import json
import boto3
from decimal import Decimal
from datetime import datetime

# Cliente de DynamoDB
dynamodb = boto3.resource('dynamodb', region_name='eu-north-1')
table = dynamodb.Table('deporte')

def lambda_handler(event, context):
    try:
        # Obtener el ID
        entrenamiento_id = event.get('pathParameters', {}).get('id')
        
        if not entrenamiento_id:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': 'ID del entrenamiento no proporcionado'
                })
            }
        
        # Parsear body
        body = json.loads(event['body']) if isinstance(event.get('body'), str) else event.get('body', {})
        
        # Construir expresión de actualización
        update_expression = "SET "
        expression_values = {}
        
        if 'tipo' in body:
            update_expression += "tipo = :tip, "
            expression_values[':tip'] = body['tipo']
        
        if 'duracion' in body:
            update_expression += "duracion = :dur, "
            expression_values[':dur'] = Decimal(str(body['duracion']))
        
        if 'ejercicios' in body:
            update_expression += "ejercicios = :eje, "
            expression_values[':eje'] = body['ejercicios']
        
        if 'fecha' in body:
            update_expression += "fecha = :fec, "
            expression_values[':fec'] = body['fecha']
        
        # Timestamp
        update_expression += "updated_at = :upd"
        expression_values[':upd'] = datetime.now().isoformat()
        
        # Actualizar
        response = table.update_item(
            Key={'id': entrenamiento_id},
            UpdateExpression=update_expression,
            ExpressionAttributeValues=expression_values,
            ReturnValues='ALL_NEW'
        )
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'message': 'Entrenamiento actualizado exitosamente',
                'entrenamiento': response['Attributes']
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