import json
import boto3
from decimal import Decimal

# Cliente de DynamoDB
dynamodb = boto3.resource('dynamodb', region_name='eu-north-1')
table = dynamodb.Table('gastos')

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
        
        # Categoría para filtrar (opcional)
        categoria = query_params.get('categoria')
        
        # Escanear la tabla (obtener todos los items)
        if categoria:
            # Filtrar por categoría
            response = table.scan(
                FilterExpression='categoria = :cat',
                ExpressionAttributeValues={':cat': categoria}
            )
        else:
            # Obtener todos los gastos
            response = table.scan()
        
        gastos = response.get('Items', [])
        
        # Ordenar por fecha (más recientes primero)
        gastos_ordenados = sorted(gastos, key=lambda x: x.get('fecha', ''), reverse=True)
        
        # Calcular total
        total = sum(float(gasto.get('cantidad', 0)) for gasto in gastos)
        
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
            'body': json.dumps({
                'error': 'Error interno del servidor',
                'details': str(e)
            })
        }