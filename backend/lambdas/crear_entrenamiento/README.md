# Lambda: Crear Entrenamiento

Función Lambda que crea un nuevo entrenamiento en DynamoDB.

## Endpoint
`POST /entrenamientos`

## Request Body
```json
{
  "tipo": "Gimnasio",
  "duracion": 60,
  "ejercicios": "Pecho y tríceps - 3x10 press banca",
  "fecha": "2026-02-24"  // Opcional, usa fecha actual si no se especifica
}
```

## Tipos de entrenamiento válidos
- `Gimnasio` - Entrenamiento con pesas
- `Cardio` - Running, bicicleta, etc.
- `Yoga` - Yoga y estiramientos
- `Natacion` - Natación
- `Otro` - Otros tipos de entrenamiento

## Response (201 Created)
```json
{
  "message": "Entrenamiento creado exitosamente",
  "entrenamiento": {
    "id": "entrenamiento_xxxxx",
    "fecha": "2026-02-24",
    "tipo": "Gimnasio",
    "duracion": 60,
    "ejercicios": "Pecho y tríceps - 3x10 press banca",
    "usuario_id": "default_user",
    "created_at": "2026-02-24T10:30:00"
  }
}
```

## Permisos necesarios
- `dynamodb:PutItem` en tabla `deporte`

## Región
- `eu-north-1` (Estocolmo)