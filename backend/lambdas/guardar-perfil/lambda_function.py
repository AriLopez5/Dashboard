import json
import boto3

dynamodb = boto3.resource('dynamodb', region_name='eu-north-1')

def lambda_handler(event, context):
    try:
        table = dynamodb.Table('perfiles')

        body = json.loads(event['body']) if isinstance(event.get('body'), str) else event.get('body', {})

        usuario_id = body.get('usuario_id', 'default_user')
        nombre = body.get('nombre', '')
        foto_url = body.get('foto_url', '')

        item = {
            'usuario_id': usuario_id,
            'nombre': nombre,
            'foto_url': foto_url
        }

        table.put_item(Item=item)

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'message': 'Perfil guardado correctamente', 'perfil': item})
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