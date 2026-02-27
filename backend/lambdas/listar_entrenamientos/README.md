# Lambda: Listar Entrenamientos

Función Lambda que recupera todos los entrenamientos de DynamoDB.

## Endpoint
`GET /entrenamientos`

## Query Parameters (opcionales)
- `tipo` - Filtrar por tipo de entrenamiento (ej: `?tipo=Gimnasio`)

## Response (200 OK)
```json
{
  "total_entrenamientos": 5,
  "total_minutos": 300,
  "entrenamientos": [
    {
      "id": "entrenamiento_xxxxx",
      "fecha": "2026-02-24",
      "tipo": "Gimnasio",
      "duracion": 60,
      "ejercicios": "Pecho y tríceps",
      "usuario_id": "default_user",
      "created_at": "2026-02-24T10:30:00"
    },
    ...
  ]
}
```

## Permisos necesarios
- `dynamodb:Scan` en tabla `deporte`

## Región
- `eu-north-1` (Estocolmo)