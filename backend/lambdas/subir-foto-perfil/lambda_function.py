import json
import boto3
import base64
import re
from botocore.exceptions import ClientError

s3 = boto3.client('s3', region_name='eu-north-1')
BUCKET = 'tfg-dashboard-fotos'

def lambda_handler(event, context):
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    }

    # Preflight
    if event.get('httpMethod') == 'OPTIONS':
        return { 'statusCode': 200, 'headers': headers, 'body': '' }

    try:
        body = json.loads(event['body']) if isinstance(event.get('body'), str) else event.get('body', {})

        usuario_id = body.get('usuario_id', 'default')
        extension = body.get('extension', 'jpg').lower()
        imagen_b64 = body.get('imagen_b64', '')

        if extension not in ['jpg', 'jpeg', 'png', 'webp']:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({ 'error': 'Extensión no permitida.' })
            }

        if not imagen_b64:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({ 'error': 'No se recibió imagen.' })
            }

        # Decodificar base64
        imagen_bytes = base64.b64decode(imagen_b64)

        # Nombre seguro del archivo
        safe_id = re.sub(r'[^a-zA-Z0-9._-]', '_', usuario_id)
        filename = f"perfiles/{safe_id}.{extension}"

        content_type = f'image/{"jpeg" if extension == "jpg" else extension}'

        # Subir a S3 directamente desde Lambda
        s3.put_object(
            Bucket=BUCKET,
            Key=filename,
            Body=imagen_bytes,
            ContentType=content_type
        )

        foto_url = f"https://{BUCKET}.s3.eu-north-1.amazonaws.com/{filename}"

        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({ 'foto_url': foto_url })
        }

    except ClientError as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({ 'error': str(e) })
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({ 'error': str(e) })
        }