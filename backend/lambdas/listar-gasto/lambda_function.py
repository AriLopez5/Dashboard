import json
import boto3
from decimal import Decimal
from boto3.dynamodb.conditions import Attr

dynamodb = boto3.resource('dynamodb', region_name='eu-north-1')
table = dynamodb.Table('gastos')

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        return super(DecimalEncoder, self).default(obj)

def lambda_handler(event, context):
    try:
        query_params = event.get('queryStringParameters', {}) or {}
        usuario_id = query_params.get('usuario_id', 'default_user')
        categoria = query_params.get('categoria')

        # Filtrar siempre por usuario_id
        if categoria:
            response = table.scan(
                FilterExpression=Attr('usuario_id').eq(usuario_id) & Attr('categoria').eq(categoria)
            )
        else:
            response = table.scan(
                FilterExpression=Attr('usuario_id').eq(usuario_id)
            )

        gastos = response.get('Items', [])
        gastos_ordenados = sorted(gastos, key=lambda x: x.get('fecha', ''), reverse=True)
        total = sum(float(g.get('cantidad', 0)) for g in gastos)

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'total_gastos': len(gastos_ordenados),
                'total_cantidad': round(total, 2),
                'gastos': gastos_ordenados
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