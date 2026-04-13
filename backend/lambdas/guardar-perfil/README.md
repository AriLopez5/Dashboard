# Lambda: Guardar Perfil

Función Lambda que guarda o actualiza los datos del perfil de un usuario en DynamoDB.

## Endpoint
`POST /perfil`

## Request Body
```json
{
  "usuario_id": "email@ejemplo.com",
  "nombre": "User",
  "foto_url": "https://tfg-dashboard-fotos.s3.eu-north-1.amazonaws.com/perfiles/email@ejemplo.com.jpg"
}
```

## Response (200 OK)
```json
{
  "message": "Perfil guardado correctamente"
}
```

## Notas
- Si el perfil no existe, lo crea. Si ya existe, lo actualiza (upsert).
- `foto_url` es opcional. Si no se envía, no se sobreescribe.
- El `usuario_id` es el email del usuario obtenido de Cognito via `getUserAttributes`.

## Permisos necesarios
- `dynamodb:PutItem` en tabla `perfiles`

## Tabla DynamoDB
- Nombre: `perfiles`
- Partition key: `usuario_id` (String)

## Región
- `eu-north-1` (Estocolmo)