import json
import boto3
import uuid
from datetime import datetime
from decimal import Decimal

dynamodb = boto3.resource('dynamodb', region_name='eu-north-1')
table = dynamodb.Table('deporte')

def lambda_handler(event, context):
    try:
        body = json.loads(event['body']) if isinstance(event.get('body'), str) else event.get('body', {})

        if 'tipo' not in body or 'duracion' not in body or 'ejercicios' not in body:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Faltan campos obligatorios: tipo, duracion y ejercicios'})
            }

        usuario_id = body.get('usuario_id', 'default_user')
        entrenamiento_id = f"entrenamiento_{uuid.uuid4().hex[:12]}"
        fecha = body.get('fecha', datetime.now().strftime('%Y-%m-%d'))

        item = {
            'id': entrenamiento_id,
            'fecha': fecha,
            'tipo': body['tipo'],
            'duracion': Decimal(str(body['duracion'])),
            'ejercicios': body['ejercicios'],
            'usuario_id': usuario_id,
            'creacion': datetime.now().isoformat()
        }

        table.put_item(Item=item)

        return {
            'statusCode': 201,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'message': 'Entrenamiento creado exitosamente', 'entrenamiento': item}, default=str)
        }

    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Error interno del servidor', 'details': str(e)})
        }