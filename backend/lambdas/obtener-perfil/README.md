# Lambda: Obtener Perfil

Función Lambda que obtiene los datos del perfil de un usuario desde DynamoDB.

## Endpoint
`GET /perfil?usuario_id=email@ejemplo.com`

## Query Parameters
```
usuario_id - Email del usuario (obtenido de Cognito getUserAttributes)
```

## Response (200 OK)
```json
{
  "perfil": {
    "usuario_id": "arilopgal@gmail.com",
    "nombre": "Ari",
    "foto_url": "https://tfg-dashboard-fotos.s3.eu-north-1.amazonaws.com/perfiles/arilopgal_gmail.com.jpg"
  }
}
```

## Response (usuario sin perfil aún)
```json
{
  "perfil": null
}
```

## Permisos necesarios
- `dynamodb:GetItem` en tabla `perfiles`

## Tabla DynamoDB
- Nombre: `perfiles`
- Partition key: `usuario_id` (String)

## Región
- `eu-north-1` (Estocolmo)