import json
import boto3
import uuid
from datetime import datetime
from decimal import Decimal

dynamodb = boto3.resource('dynamodb', region_name='eu-north-1')
table = dynamodb.Table('gastos')

def lambda_handler(event, context):
    try:
        body = json.loads(event['body']) if isinstance(event.get('body'), str) else event.get('body', {})

        if 'cantidad' not in body or 'categoria' not in body:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Faltan campos obligatorios: cantidad y categoria'})
            }

        usuario_id = body.get('usuario_id', 'default_user')
        gasto_id = f"gasto_{uuid.uuid4().hex[:12]}"
        fecha = body.get('fecha', datetime.now().strftime('%Y-%m-%d'))

        item = {
            'id': gasto_id,
            'fecha': fecha,
            'cantidad': Decimal(str(body['cantidad'])),
            'categoria': body['categoria'],
            'descripcion': body.get('descripcion', ''),
            'usuario_id': usuario_id,
            'created_at': datetime.now().isoformat()
        }

        table.put_item(Item=item)

        return {
            'statusCode': 201,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'message': 'Gasto creado exitosamente', 'gasto': item}, default=str)
        }

    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Error interno del servidor', 'details': str(e)})
        }