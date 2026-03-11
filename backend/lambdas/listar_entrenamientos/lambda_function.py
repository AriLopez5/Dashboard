import json
import boto3
from decimal import Decimal
from boto3.dynamodb.conditions import Attr

dynamodb = boto3.resource('dynamodb', region_name='eu-north-1')
table = dynamodb.Table('deporte')

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        return super(DecimalEncoder, self).default(obj)

def lambda_handler(event, context):
    try:
        query_params = event.get('queryStringParameters', {}) or {}
        usuario_id = query_params.get('usuario_id', 'default_user')
        tipo = query_params.get('tipo')

        if tipo:
            response = table.scan(
                FilterExpression=Attr('usuario_id').eq(usuario_id) & Attr('tipo').eq(tipo)
            )
        else:
            response = table.scan(
                FilterExpression=Attr('usuario_id').eq(usuario_id)
            )

        entrenamientos = response.get('Items', [])
        entrenamientos_ordenados = sorted(entrenamientos, key=lambda x: x.get('fecha', ''), reverse=True)
        total_minutos = sum(float(e.get('duracion', 0)) for e in entrenamientos)

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'total_entrenamientos': len(entrenamientos_ordenados),
                'total_minutos': round(total_minutos, 2),
                'entrenamientos': entrenamientos_ordenados
            }, cls=DecimalEncoder)
        }

    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Error interno del servidor', 'details': str(e)})
        }