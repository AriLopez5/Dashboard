import json
import boto3
import uuid
from datetime import datetime
from decimal import Decimal

dynamodb = boto3.resource('dynamodb', region_name='eu-north-1')
sns = boto3.client('sns', region_name='eu-north-1')

tabla_gastos = dynamodb.Table('gastos')
tabla_metas  = dynamodb.Table('metas')

HEADERS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
}

def get_topic_arn(email):
    nombre = 'dashboard-' + email.replace('@', '-').replace('.', '-')
    try:
        topic = sns.create_topic(Name=nombre)
        return topic['TopicArn']
    except Exception as e:
        print(f'Error obteniendo topic ARN: {e}')
        return None

def lambda_handler(event, context):
    try:
        body = json.loads(event['body']) if isinstance(event.get('body'), str) else event.get('body', {})

        if 'cantidad' not in body or 'categoria' not in body:
            return {'statusCode': 400, 'headers': HEADERS,
                    'body': json.dumps({'error': 'Faltan campos obligatorios: cantidad y categoria'})}

        usuario_id = body.get('usuario_id', 'default_user')
        gasto_id   = f"gasto_{uuid.uuid4().hex[:12]}"
        fecha      = body.get('fecha', datetime.now().strftime('%Y-%m-%d'))
        mes        = fecha[:7]

        item = {
            'id':          gasto_id,
            'fecha':       fecha,
            'cantidad':    Decimal(str(body['cantidad'])),
            'categoria':   body['categoria'],
            'descripcion': body.get('descripcion', ''),
            'usuario_id':  usuario_id,
            'created_at':  datetime.now().isoformat()
        }

        tabla_gastos.put_item(Item=item)

        # ── Comprobar si se supera el presupuesto mensual ─────────────────
        try:
            meta_resp = tabla_metas.get_item(Key={'usuario_id': usuario_id, 'mes': mes})
            meta = meta_resp.get('Item')
            print(f"usuario_id: {usuario_id}, mes: {mes}")
            print(f"Meta encontrada: {meta}")

            if meta and meta.get('presupuesto_gastos'):
                presupuesto = float(meta['presupuesto_gastos'])

                todos = tabla_gastos.scan(
                    FilterExpression='usuario_id = :uid AND begins_with(fecha, :mes)',
                    ExpressionAttributeValues={':uid': usuario_id, ':mes': mes}
                ).get('Items', [])

                total_mes = sum(float(g['cantidad']) for g in todos)
                print(f"Total mes: {total_mes} | Presupuesto: {presupuesto}")

                if total_mes >= presupuesto:
                    topic_arn = get_topic_arn(usuario_id)
                    if topic_arn:
                        sns.publish(
                            TopicArn=topic_arn,
                            Subject='⚠️ Has superado tu presupuesto mensual',
                            Message=(
                                f'Hola,\n\n'
                                f'Has superado tu presupuesto mensual en MyDashboard.\n\n'
                                f'💸 Total gastado en {mes}: {total_mes:.2f} €\n'
                                f'🎯 Tu presupuesto: {presupuesto:.2f} €\n\n'
                                f'Accede a tu dashboard:\n'
                                f'https://d1qut4smuxllg2.cloudfront.net\n\n'
                                f'— MyDashboard'
                            )
                        )
                        print(f'Notificación SNS enviada a {usuario_id}')
        except Exception as e:
            print(f'Error comprobando presupuesto: {e}')
            import traceback
            print(traceback.format_exc())

        return {
            'statusCode': 201,
            'headers': HEADERS,
            'body': json.dumps({'message': 'Gasto creado exitosamente', 'gasto': item}, default=str)
        }

    except Exception as e:
        print(f'Error: {str(e)}')
        import traceback
        print(traceback.format_exc())
        return {'statusCode': 500, 'headers': HEADERS,
                'body': json.dumps({'error': 'Error interno del servidor', 'details': str(e)})}