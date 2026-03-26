import json
import boto3

sns = boto3.client('sns', region_name='eu-north-1')

def lambda_handler(event, context):
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    try:
        body = json.loads(event.get('body', '{}'))
        usuario_id = body.get('usuario_id')
        email = body.get('email')

        if not usuario_id or not email:
            return {'statusCode': 400, 'headers': headers,
                    'body': json.dumps({'error': 'Faltan datos'})}

        # Nombre del topic: letras y guiones solo
        nombre_topic = 'dashboard-' + email.replace('@', '-').replace('.', '-')

        # Crear el topic (si ya existe, devuelve el mismo ARN)
        topic = sns.create_topic(Name=nombre_topic)
        topic_arn = topic['TopicArn']

        # Suscribir el email (manda email de confirmación)
        sns.subscribe(
            TopicArn=topic_arn,
            Protocol='email',
            Endpoint=email,
            ReturnSubscriptionArn=True
        )

        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'topic_arn': topic_arn,
                'mensaje': 'Suscripción creada. Revisa tu email para confirmar.'
            })
        }

    except Exception as e:
        print(f'ERROR: {str(e)}')
        return {'statusCode': 500, 'headers': headers,
                'body': json.dumps({'error': str(e)})}