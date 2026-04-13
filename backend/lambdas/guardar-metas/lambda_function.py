import json
import boto3
from decimal import Decimal

dynamodb = boto3.resource('dynamodb', region_name='eu-north-1')
table = dynamodb.Table('metas')

def lambda_handler(event, context):
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    }

    if event.get('httpMethod') == 'OPTIONS':
        return { 'statusCode': 200, 'headers': headers, 'body': '' }

    try:
        body = json.loads(event['body']) if isinstance(event.get('body'), str) else event.get('body', {})

        usuario_id = body.get('usuario_id')
        mes = body.get('mes')  # formato: 2026-03

        if not usuario_id or not mes:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({ 'error': 'Faltan campos: usuario_id y mes' })
            }

        item = {
            'usuario_id': usuario_id,
            'mes': mes,
        }

        # Presupuesto de gastos (opcional)
        if 'presupuesto_gastos' in body and body['presupuesto_gastos'] is not None:
            item['presupuesto_gastos'] = Decimal(str(body['presupuesto_gastos']))

        # Meta de sesiones de deporte (opcional)
        if 'meta_sesiones' in body and body['meta_sesiones'] is not None:
            item['meta_sesiones'] = Decimal(str(body['meta_sesiones']))

        table.put_item(Item=item)

        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({ 'message': 'Metas guardadas correctamente' })
        }

    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({ 'error': str(e) })
        }