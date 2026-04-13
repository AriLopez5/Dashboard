# Lambda: Suscribir Usuario

Función Lambda que crea (o reutiliza) un topic de SNS por usuario y suscribe su email para recibir notificaciones.

## Endpoint
`POST /suscribir-usuario`

## Request Body
```json
{
  "usuario_id": "email@ejemplo.com",
  "email": "email@ejemplo.com"
}
```

## Response (200 OK)
```json
{
  "topic_arn": "arn:aws:sns:eu-north-1:123456789012:dashboard-emailejemplo-gmail-com",
  "mensaje": "Suscripción creada. Revisa tu email para confirmar."
}
```

## Response (error)
```json
{
  "error": "Descripción del error"
}
```

## Notas
- Requiere `usuario_id` y `email` en el body.
- Si faltan datos devuelve `400` con `{"error": "Faltan datos"}`.
- El nombre del topic se genera como `dashboard-{email_sanitizado}`.
- Se sustituyen `@` y `.` por `-` para cumplir el formato del nombre del topic.
- `create_topic` es idempotente: si ya existe, SNS devuelve el mismo ARN.
- La suscripción por email envía un correo de confirmación al usuario.
- Hasta que no confirme desde el email, no recibirá notificaciones.

## Infraestructura SNS
- Servicio: Amazon SNS
- Región: `eu-north-1`
- Topic por usuario: `dashboard-{email_sanitizado}`
- Protocolo de suscripción: `email`

## Permisos necesarios
- `sns:CreateTopic`
- `sns:Subscribe`

## Región
- `eu-north-1` (Estocolmo)