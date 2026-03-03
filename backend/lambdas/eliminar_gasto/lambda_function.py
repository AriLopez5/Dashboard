import json
import boto3

# Cliente de DynamoDB
dynamodb = boto3.resource('dynamodb', region_name='eu-north-1')
table = dynamodb.Table('gastos')

def lambda_handler(event, context):
    try:
        # Obtener el ID del gasto desde el path
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
        
        # Eliminar el item de DynamoDB
        table.delete_item(
            Key={'id': gasto_id}
        )
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'message': 'Gasto eliminado exitosamente',
                'id': gasto_id
            })
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