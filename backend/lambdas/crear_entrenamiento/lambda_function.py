import json
import boto3
import uuid
from datetime import datetime
from decimal import Decimal

# Cliente de DynamoDB
dynamodb = boto3.resource('dynamodb', region_name='eu-north-1')
table = dynamodb.Table('deporte')

def lambda_handler(event, context):
    try:
        # Parsear el body del request
        body = json.loads(event['body']) if isinstance(event.get('body'), str) else event.get('body', {})
        
        # Validar campos obligatorios
        if 'tipo' not in body or 'duracion' not in body or 'ejercicios' not in body:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': 'Faltan campos obligatorios: tipo, duracion y ejercicios'
                })
            }
        
        # Generar ID único
        entrenamiento_id = f"entrenamiento_{uuid.uuid4().hex[:12]}"
        
        # Obtener la fecha actual si no se proporciona
        fecha = body.get('fecha', datetime.now().strftime('%Y-%m-%d'))
        
        # Crear el item
        item = {
            'id': entrenamiento_id,
            'fecha': fecha,
            'tipo': body['tipo'],
            'duracion': Decimal(str(body['duracion'])),
            'ejercicios': body['ejercicios'],
            'usuario_id': body.get('usuario_id', 'default_user'),
            'creacion': datetime.now().isoformat()
        }
        
        # Guardar en DynamoDB
        table.put_item(Item=item)
        
        return {
            'statusCode': 201,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'message': 'Entrenamiento creado exitosamente',
                'entrenamiento': item
            }, default=str)
        }
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'Error interno del servidor',
                'details': str(e)
            })
        }