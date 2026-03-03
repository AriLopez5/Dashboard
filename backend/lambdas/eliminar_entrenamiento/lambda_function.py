import json
import boto3

# Cliente de DynamoDB
dynamodb = boto3.resource('dynamodb', region_name='eu-north-1')
table = dynamodb.Table('deporte')

def lambda_handler(event, context):
    try:
        # Obtener el ID desde el path
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
        
        # Eliminar el item
        table.delete_item(
            Key={'id': entrenamiento_id}
        )
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'message': 'Entrenamiento eliminado exitosamente',
                'id': entrenamiento_id
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