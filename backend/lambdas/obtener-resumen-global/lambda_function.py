import json
import boto3
from decimal import Decimal
from collections import defaultdict

dynamodb = boto3.resource('dynamodb', region_name='eu-north-1')
tabla_gastos = dynamodb.Table('gastos')
tabla_deporte = dynamodb.Table('deporte')
tabla_perfiles = dynamodb.Table('perfiles')

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        return super(DecimalEncoder, self).default(obj)

def lambda_handler(event, context):
    try:
        # Obtener todos los gastos
        gastos = tabla_gastos.scan().get('Items', [])

        # Obtener todos los entrenamientos
        entrenamientos = tabla_deporte.scan().get('Items', [])

        # Obtener todos los perfiles (para nombres)
        perfiles_raw = tabla_perfiles.scan().get('Items', [])
        perfiles = { p['usuario_id']: p.get('nombre', p['usuario_id'].split('@')[0]) for p in perfiles_raw }

        # Agrupar gastos por usuario
        gastos_por_usuario = defaultdict(lambda: {'total': 0, 'cantidad': 0})
        for g in gastos:
            uid = g.get('usuario_id', 'desconocido')
            gastos_por_usuario[uid]['total'] += float(g.get('cantidad', 0))
            gastos_por_usuario[uid]['cantidad'] += 1

        # Agrupar entrenamientos por usuario
        deporte_por_usuario = defaultdict(lambda: {'minutos': 0, 'sesiones': 0})
        for e in entrenamientos:
            uid = e.get('usuario_id', 'desconocido')
            deporte_por_usuario[uid]['minutos'] += float(e.get('duracion', 0))
            deporte_por_usuario[uid]['sesiones'] += 1

        # Unir todos los usuarios conocidos
        todos_usuarios = set(list(gastos_por_usuario.keys()) + list(deporte_por_usuario.keys()))

        usuarios_resumen = []
        for uid in todos_usuarios:
            nombre = perfiles.get(uid, uid.split('@')[0] if '@' in uid else uid)
            usuarios_resumen.append({
                'usuario_id': uid,
                'nombre': nombre,
                'gastos_total': round(gastos_por_usuario[uid]['total'], 2),
                'gastos_cantidad': gastos_por_usuario[uid]['cantidad'],
                'deporte_minutos': round(deporte_por_usuario[uid]['minutos'], 0),
                'deporte_sesiones': deporte_por_usuario[uid]['sesiones'],
            })

        # Totales globales
        total_global_gastos = round(sum(float(g.get('cantidad', 0)) for g in gastos), 2)
        total_global_minutos = round(sum(float(e.get('duracion', 0)) for e in entrenamientos), 0)

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
                    'gastos_total': total_global_gastos,
                    'gastos_registros': len(gastos),
                    'deporte_minutos': total_global_minutos,
                    'deporte_sesiones': len(entrenamientos),
                }
            }, cls=DecimalEncoder)
        }

    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Error interno del servidor', 'details': str(e)})
        }