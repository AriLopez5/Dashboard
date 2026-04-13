import json
import boto3
from decimal import Decimal

dynamodb = boto3.resource('dynamodb', region_name='eu-north-1')
table = dynamodb.Table('metas')

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        return super(DecimalEncoder, self).default(obj)

def lambda_handler(event, context):
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
    }

    if event.get('httpMethod') == 'OPTIONS':
        return { 'statusCode': 200, 'headers': headers, 'body': '' }

    try:
        query_params = event.get('queryStringParameters', {}) or {}
        usuario_id = query_params.get('usuario_id')
        mes = query_params.get('mes')  # formato: 2026-03

        if not usuario_id or not mes:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({ 'error': 'Faltan parámetros: usuario_id y mes' })
            }

        response = table.get_item(Key={ 'usuario_id': usuario_id, 'mes': mes })
        meta = response.get('Item')

        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({ 'meta': meta }, cls=DecimalEncoder)
        }

    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({ 'error': str(e) })
        }