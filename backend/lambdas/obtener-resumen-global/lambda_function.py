import json
import boto3
from decimal import Decimal
from collections import defaultdict
from datetime import datetime

dynamodb = boto3.resource('dynamodb', region_name='eu-north-1')
tabla_gastos = dynamodb.Table('gastos')
tabla_deporte = dynamodb.Table('deporte')
tabla_perfiles = dynamodb.Table('perfiles')

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        return super(DecimalEncoder, self).default(obj)

def normalizar_fecha(fecha_raw):
    if not fecha_raw:
        return None

    fecha_txt = str(fecha_raw).strip()
    if not fecha_txt:
        return None

    fecha_base = fecha_txt.split('T')[0].split(' ')[0]

    for fmt in ('%Y-%m-%d', '%d/%m/%Y'):
        try:
            return datetime.strptime(fecha_base, fmt).strftime('%Y-%m-%d')
        except ValueError:
            continue

    return None

def lambda_handler(event, context):
    print("=== INICIO ===")
    try:
        query_params = event.get('queryStringParameters', {}) or {}
        fecha_inicio = query_params.get('fecha_inicio')
        fecha_fin = query_params.get('fecha_fin')

        if (fecha_inicio and not fecha_fin) or (fecha_fin and not fecha_inicio):
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Debes enviar fecha_inicio y fecha_fin juntos (YYYY-MM-DD)'})
            }

        if fecha_inicio and fecha_fin and fecha_inicio > fecha_fin:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'fecha_inicio no puede ser mayor que fecha_fin'})
            }

        gastos = tabla_gastos.scan().get('Items', [])
        print(f"Gastos: {len(gastos)}")
        entrenamientos = tabla_deporte.scan().get('Items', [])
        print(f"Entrenamientos: {len(entrenamientos)}")
        perfiles_raw = tabla_perfiles.scan().get('Items', [])
        perfiles = {
            p['usuario_id']: {
                'nombre': p.get('nombre', p['usuario_id'].split('@')[0]),
                'foto_url': p.get('foto_url', '')
            }
            for p in perfiles_raw
        }

        # Totales por usuario
        gastos_por_usuario = defaultdict(lambda: {'total': 0, 'cantidad': 0})
        for g in gastos:
            uid = g.get('usuario_id', 'desconocido')
            gastos_por_usuario[uid]['total'] += float(g.get('cantidad', 0))
            gastos_por_usuario[uid]['cantidad'] += 1

        deporte_por_usuario = defaultdict(lambda: {'minutos': 0, 'sesiones': 0})
        for e in entrenamientos:
            uid = e.get('usuario_id', 'desconocido')
            deporte_por_usuario[uid]['minutos'] += float(e.get('duracion', 0))
            deporte_por_usuario[uid]['sesiones'] += 1

        # Rankings por mes
        gastos_por_mes = defaultdict(lambda: defaultdict(float))
        for g in gastos:
            uid = g.get('usuario_id', 'desconocido')
            fecha = g.get('fecha', '')
            mes = fecha[:7] if fecha else ''
            print(f"Gasto fecha: {fecha} -> mes: {mes}")
            if mes:
                gastos_por_mes[mes][uid] += float(g.get('cantidad', 0))

        deporte_por_mes = defaultdict(lambda: defaultdict(float))
        for e in entrenamientos:
            uid = e.get('usuario_id', 'desconocido')
            fecha = e.get('fecha', '')
            mes = fecha[:7] if fecha else ''
            print(f"Deporte fecha: {fecha} -> mes: {mes}")
            if mes:
                deporte_por_mes[mes][uid] += float(e.get('duracion', 0))

        print(f"gastos_por_mes keys: {list(gastos_por_mes.keys())}")
        print(f"deporte_por_mes keys: {list(deporte_por_mes.keys())}")

        todos_meses = set(list(gastos_por_mes.keys()) + list(deporte_por_mes.keys()))

        def fila(uid, valor):
            p = perfiles.get(uid, {})
            return {
                'usuario_id': uid,
                'nombre': p.get('nombre', uid.split('@')[0]),
                'foto_url': p.get('foto_url', ''),
                'valor': round(float(valor), 2)
            }

        rankings_por_mes = {}
        for mes in todos_meses:
            rankings_por_mes[mes] = {
                'gastos': sorted(
                    [fila(uid, val) for uid, val in gastos_por_mes[mes].items()],
                    key=lambda x: x['valor'], reverse=True
                )[:5],
                'deporte': sorted(
                    [fila(uid, val) for uid, val in deporte_por_mes[mes].items()],
                    key=lambda x: x['valor'], reverse=True
                )[:5],
            }

        ranking_por_rango = None
        if fecha_inicio and fecha_fin:
            gastos_rango = defaultdict(float)
            for g in gastos:
                uid = g.get('usuario_id', 'desconocido')
                fecha_normalizada = normalizar_fecha(g.get('fecha', ''))
                if fecha_normalizada and fecha_inicio <= fecha_normalizada <= fecha_fin:
                    gastos_rango[uid] += float(g.get('cantidad', 0))

            deporte_rango = defaultdict(float)
            for e in entrenamientos:
                uid = e.get('usuario_id', 'desconocido')
                fecha_normalizada = normalizar_fecha(e.get('fecha', ''))
                if fecha_normalizada and fecha_inicio <= fecha_normalizada <= fecha_fin:
                    deporte_rango[uid] += float(e.get('duracion', 0))

            ranking_por_rango = {
                'fecha_inicio': fecha_inicio,
                'fecha_fin': fecha_fin,
                'gastos': sorted(
                    [fila(uid, val) for uid, val in gastos_rango.items()],
                    key=lambda x: x['valor'], reverse=True
                )[:5],
                'deporte': sorted(
                    [fila(uid, val) for uid, val in deporte_rango.items()],
                    key=lambda x: x['valor'], reverse=True
                )[:5],
            }

        todos_usuarios = set(list(gastos_por_usuario.keys()) + list(deporte_por_usuario.keys()))
        usuarios_resumen = []
        for uid in todos_usuarios:
            p = perfiles.get(uid, {})
            usuarios_resumen.append({
                'usuario_id': uid,
                'nombre': p.get('nombre', uid.split('@')[0]),
                'foto_url': p.get('foto_url', ''),
                'gastos_total': round(gastos_por_usuario[uid]['total'], 2),
                'gastos_cantidad': gastos_por_usuario[uid]['cantidad'],
                'deporte_minutos': round(deporte_por_usuario[uid]['minutos'], 0),
                'deporte_sesiones': deporte_por_usuario[uid]['sesiones'],
            })

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'usuarios': usuarios_resumen,
                'totales': {
                    'num_usuarios': len(todos_usuarios),
                    'gastos_total': round(sum(float(g.get('cantidad', 0)) for g in gastos), 2),
                    'gastos_registros': len(gastos),
                    'deporte_minutos': round(sum(float(e.get('duracion', 0)) for e in entrenamientos), 0),
                    'deporte_sesiones': len(entrenamientos),
                },
                'rankings_por_mes': rankings_por_mes,
                'ranking_por_rango': ranking_por_rango
            }, cls=DecimalEncoder)
        }

    except Exception as e:
        print(f"ERROR: {str(e)}")
        import traceback
        print(traceback.format_exc())
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)})
        }