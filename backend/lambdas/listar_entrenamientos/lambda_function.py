import json
import boto3
from decimal import Decimal

# Cliente de DynamoDB
dynamodb = boto3.resource('dynamodb', region_name='eu-north-1')
table = dynamodb.Table('deporte')

# Función helper para convertir Decimal a float en JSON
class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        return super(DecimalEncoder, self).default(obj)

def lambda_handler(event, context):
    try:
        # Obtener parámetros opcionales de query string
        query_params = event.get('queryStringParameters', {}) or {}
        
        # Tipo para filtrar (opcional)
        tipo = query_params.get('tipo')
        
        # Escanear la tabla
        if tipo:
            # Filtrar por tipo
            response = table.scan(
                FilterExpression='tipo = :t',
                ExpressionAttributeValues={':t': tipo}
            )
        else:
            # Obtener todos los entrenamientos
            response = table.scan()
        
        entrenamientos = response.get('Items', [])
        
        # Ordenar por fecha (más recientes primero)
        entrenamientos_ordenados = sorted(entrenamientos, key=lambda x: x.get('fecha', ''), reverse=True)
        
        # Calcular total de minutos
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
            'body': json.dumps({
                'error': 'Error interno del servidor',
                'details': str(e)
            })
        }