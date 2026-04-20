import json
import boto3
import uuid
from datetime import datetime
from decimal import Decimal

dynamodb = boto3.resource('dynamodb', region_name='eu-north-1')
sns = boto3.client('sns', region_name='eu-north-1')

tabla_deporte = dynamodb.Table('deporte')
tabla_metas   = dynamodb.Table('metas')

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

        if 'tipo' not in body or 'duracion' not in body or 'ejercicios' not in body:
            return {'statusCode': 400, 'headers': HEADERS,
                    'body': json.dumps({'error': 'Faltan campos obligatorios: tipo, duracion y ejercicios'})}

        usuario_id       = body.get('usuario_id', 'default_user')
        entrenamiento_id = f"entrenamiento_{uuid.uuid4().hex[:12]}"
        fecha            = body.get('fecha', datetime.now().strftime('%Y-%m-%d'))
        mes              = fecha[:7]

        item = {
            'id':         entrenamiento_id,
            'fecha':      fecha,
            'tipo':       body['tipo'],
            'duracion':   Decimal(str(body['duracion'])),
            'ejercicios': body['ejercicios'],
            'usuario_id': usuario_id,
            'creacion':   datetime.now().isoformat()
        }

        tabla_deporte.put_item(Item=item)

        # ── Comprobar si se alcanza la meta de sesiones ───────────────────
        try:
            meta_resp = tabla_metas.get_item(Key={'usuario_id': usuario_id, 'mes': mes})
            meta = meta_resp.get('Item')
            print(f"usuario_id: {usuario_id}, mes: {mes}")
            print(f"Meta encontrada: {meta}")

            if meta and meta.get('meta_sesiones'):
                meta_sesiones = int(meta['meta_sesiones'])

                todos = tabla_deporte.scan(
                    FilterExpression='usuario_id = :uid AND begins_with(fecha, :mes)',
                    ExpressionAttributeValues={':uid': usuario_id, ':mes': mes}
                ).get('Items', [])

                total_sesiones = len(todos)
                print(f"Sesiones mes: {total_sesiones} | Meta: {meta_sesiones}")

                if total_sesiones >= meta_sesiones:
                    topic_arn = get_topic_arn(usuario_id)
                    if topic_arn:
                        sns.publish(
                            TopicArn=topic_arn,
                            Subject='🏆 ¡Has alcanzado tu meta deportiva del mes!',
                            Message=(
                                f'Hola,\n\n'
                                f'¡Enhorabuena! Has alcanzado tu meta deportiva en MyDashboard.\n\n'
                                f'🏋️ Sesiones completadas en {mes}: {total_sesiones}\n'
                                f'🎯 Tu meta: {meta_sesiones} sesiones\n\n'
                                f'Accede a tu dashboard:\n'
                                f'https://d1qut4smuxllg2.cloudfront.net\n\n'
                                f'— MyDashboard'
                            )
                        )
                        print(f'Notificación SNS enviada a {usuario_id}')
        except Exception as e:
            print(f'Error comprobando meta sesiones: {e}')
            import traceback
            print(traceback.format_exc())

        return {
            'statusCode': 201,
            'headers': HEADERS,
            'body': json.dumps({'message': 'Entrenamiento creado exitosamente', 'entrenamiento': item}, default=str)
        }

    except Exception as e:
        print(f'Error: {str(e)}')
        import traceback
        print(traceback.format_exc())
        return {'statusCode': 500, 'headers': HEADERS,
                'body': json.dumps({'error': 'Error interno del servidor', 'details': str(e)})}