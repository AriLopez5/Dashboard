# Lambda: Actualizar Entrenamiento

Función Lambda que actualiza los datos de un entrenamiento existente en DynamoDB.

## Endpoint
`PUT /entrenamientos/{id}`

## Path Parameters
- `id` (requerido) - ID del entrenamiento a actualizar

## Request Body
```json
{
  "tipo": "Gimnasio",
  "duracion": 75,
  "ejercicios": "Piernas - 4x12 sentadillas, 3x15 prensa",
  "fecha": "2026-02-24"
}
```

Todos los campos son opcionales. Solo se actualizarán los campos enviados.

## Tipos de entrenamiento válidos
- `Gimnasio` - Entrenamiento con pesas
- `Cardio` - Running, bicicleta, elíptica
- `Yoga` - Yoga y estiramientos
- `Natacion` - Natación y actividades acuáticas
- `Otro` - Otros tipos de entrenamiento

## Response (200 OK)
```json
{
  "message": "Entrenamiento actualizado exitosamente",
  "entrenamiento": {
    "id": "entrenamiento_xyz789abc123",
    "tipo": "Gimnasio",
    "duracion": 75,
    "ejercicios": "Piernas - 4x12 sentadillas, 3x15 prensa",
    "fecha": "2026-02-24",
    "usuario_id": "default_user",
    "created_at": "2026-02-23T18:00:00",
    "updated_at": "2026-02-24T19:30:00"
  }
}
```

## Response (400 Bad Request)
```json
{
  "error": "ID del entrenamiento no proporcionado"
}
```

## Response (500 Internal Server Error)
```json
{
  "error": "Error interno del servidor",
  "details": "Descripción del error"
}
```

## Permisos necesarios
- `dynamodb:UpdateItem` en tabla `deporte`

## Región
- `eu-north-1` (Estocolmo)

## Notas
- Añade automáticamente un campo `updated_at` con el timestamp de la actualización
- No es necesario enviar todos los campos, solo los que se quieren modificar
- El ID en el path debe coincidir con un registro existente
- La duración debe ser un número entero (minutos)
```
