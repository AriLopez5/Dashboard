import json
import boto3
import uuid
from datetime import datetime
from decimal import Decimal

# Cliente de DynamoDB con región explícita
dynamodb = boto3.resource('dynamodb', region_name='eu-north-1')

def lambda_handler(event, context):
    try:
        # Listar todas las tablas disponibles
        dynamodb_client = boto3.client('dynamodb', region_name='eu-north-1')
        tables_list = dynamodb_client.list_tables()
        
        print(f"Tablas disponibles: {tables_list}")
        
        # Intentar acceder a la tabla
        table = dynamodb.Table('gastos')
        
        print(f"Tabla encontrada: {table.table_name}")
        
        # Parsear el body del request
        body = json.loads(event['body']) if isinstance(event.get('body'), str) else event.get('body', {})
        
        # Validar campos obligatorios
        if 'cantidad' not in body or 'categoria' not in body:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': 'Faltan campos obligatorios: cantidad y categoria'
                })
            }
        
        # Generar ID único
        gasto_id = f"gasto_{uuid.uuid4().hex[:12]}"
        
        # Obtener la fecha actual si no se proporciona
        fecha = body.get('fecha', datetime.now().strftime('%Y-%m-%d'))
        
        # Crear el item
        item = {
            'id': gasto_id,
            'fecha': fecha,
            'cantidad': Decimal(str(body['cantidad'])),
            'categoria': body['categoria'],
            'descripcion': body.get('descripcion', ''),
            'usuario_id': body.get('usuario_id', 'default_user'),
            'created_at': datetime.now().isoformat()
        }
        
        print(f"Item a guardar: {item}")
        
        # Guardar en DynamoDB
        response = table.put_item(Item=item)
        
        print(f"Respuesta de DynamoDB: {response}")
        
        return {
            'statusCode': 201,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'message': 'Gasto creado exitosamente',
                'gasto': item,
                'tablas_disponibles': tables_list['TableNames']
            }, default=str)
        }
        
    except Exception as e:
        print(f"Error completo: {str(e)}")
        print(f"Tipo de error: {type(e).__name__}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'Error interno del servidor',
                'details': str(e),
                'error_type': type(e).__name__
            })
        }