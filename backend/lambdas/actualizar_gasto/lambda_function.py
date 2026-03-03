import json
import boto3
from decimal import Decimal
from datetime import datetime

# Cliente de DynamoDB
dynamodb = boto3.resource('dynamodb', region_name='eu-north-1')
table = dynamodb.Table('gastos')

def lambda_handler(event, context):
    try:
        # Obtener el ID del path
        gasto_id = event.get('pathParameters', {}).get('id')
        
        if not gasto_id:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': 'ID del gasto no proporcionado'
                })
            }
        
        # Parsear el body
        body = json.loads(event['body']) if isinstance(event.get('body'), str) else event.get('body', {})
        
        # Construir la expresión de actualización
        update_expression = "SET "
        expression_values = {}
        expression_names = {}
        
        if 'cantidad' in body:
            update_expression += "#cant = :cant, "
            expression_values[':cant'] = Decimal(str(body['cantidad']))
            expression_names['#cant'] = 'cantidad'
        
        if 'categoria' in body:
            update_expression += "categoria = :cat, "
            expression_values[':cat'] = body['categoria']
        
        if 'descripcion' in body:
            update_expression += "descripcion = :desc, "
            expression_values[':desc'] = body['descripcion']
        
        if 'fecha' in body:
            update_expression += "fecha = :fec, "
            expression_values[':fec'] = body['fecha']
        
        # Añadir timestamp de actualización
        update_expression += "updated_at = :upd"
        expression_values[':upd'] = datetime.now().isoformat()
        
        # Actualizar en DynamoDB
        response = table.update_item(
            Key={'id': gasto_id},
            UpdateExpression=update_expression,
            ExpressionAttributeValues=expression_values,
            ExpressionAttributeNames=expression_names if expression_names else None,
            ReturnValues='ALL_NEW'
        )
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'message': 'Gasto actualizado exitosamente',
                'gasto': response['Attributes']
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