import json
import boto3

dynamodb = boto3.resource('dynamodb', region_name='eu-north-1')

def lambda_handler(event, context):
    try:
        table = dynamodb.Table('perfiles')

        # Obtener el usuario_id de los query params
        params = event.get('queryStringParameters') or {}
        usuario_id = params.get('usuario_id', 'default_user')

        response = table.get_item(Key={'usuario_id': usuario_id})
        perfil = response.get('Item', None)

        if not perfil:
            # Si no existe perfil, devolver uno vacío
            perfil = {
                'usuario_id': usuario_id,
                'nombre': '',
                'foto_url': ''
            }

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'perfil': perfil}, default=str)
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)})
        }