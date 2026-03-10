# Lambda: Subir Foto Perfil

Función Lambda que recibe una imagen en base64 y la sube al bucket S3 `tfg-dashboard-fotos`.

## Endpoint
`POST /foto`

## Request Body
```json
{
  "usuario_id": "arilopgal@gmail.com",
  "extension": "jpg",
  "imagen_b64": "/9j/4AAQSkZJRgABAQAAAQABAAD..."
}
```

## Extensiones permitidas
- `jpg` / `jpeg`
- `png`
- `webp`

## Response (200 OK)
```json
{
  "foto_url": "https://tfg-dashboard-fotos.s3.eu-north-1.amazonaws.com/perfiles/arilopgal_gmail.com.jpg"
}
```

## Response (error)
```json
{
  "error": "Descripción del error"
}
```

## Notas
- La imagen se envía en base64 en el body (no como multipart/form-data).
- El nombre del archivo se genera a partir del `usuario_id` sanitizado.
- Si ya existe una foto para ese usuario, se sobreescribe.
- Límite de tamaño: 6MB (límite de API Gateway).
- La URL devuelta se guarda en DynamoDB via la lambda `guardar-perfil`.

## Infraestructura S3
- Bucket: `tfg-dashboard-fotos`
- Ruta: `perfiles/{usuario_id_sanitizado}.{extension}`
- Acceso público de lectura habilitado
- CORS configurado para PUT y GET desde cualquier origen

## Permisos necesarios
- `s3:PutObject` en bucket `tfg-dashboard-fotos`

## Región
- `eu-north-1` (Estocolmo)