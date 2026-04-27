# Lambda: Crear Entrenamiento

Función Lambda que crea un nuevo entrenamiento en DynamoDB y, si el usuario tiene una meta mensual configurada, verifica si se alcanza la meta de sesiones para enviar una notificación SNS.

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

## Campos obligatorios
- `tipo`
- `duracion`
- `ejercicios`

## Campos opcionales
- `fecha` (formato `YYYY-MM-DD`; si no se envía, usa la fecha actual)
- `usuario_id` (si no se envía, usa `default_user`)

## Comportamiento adicional
- Guarda el entrenamiento en la tabla `deporte` con un `id` generado con el prefijo `entrenamiento_`.
- Convierte `duracion` a `Decimal` antes de persistirlo en DynamoDB.
- Después de guardar, busca la meta mensual en la tabla `metas` usando `usuario_id` y el mes de la fecha.
- Si existe `meta_sesiones` y el total de sesiones del mes alcanza o supera la meta, crea o reutiliza un topic SNS del usuario y envía una notificación.

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
    "duracion": "60",
    "ejercicios": "Pecho y tríceps - 3x10 press banca",
    "usuario_id": "email@ejemplo.com",
    "creacion": "2026-02-24T10:30:00"
  }
}
```

## Response (400 Bad Request)
```json
{
  "error": "Faltan campos obligatorios: tipo, duracion y ejercicios"
}
```

## Response (500 Internal Server Error)
```json
{
  "error": "Error interno del servidor",
  "details": "Descripción del error"
}
```

## Notas
- La respuesta serializa valores `Decimal` usando `default=str`, por lo que `duracion` puede aparecer como cadena.
- La validación de meta se hace sobre las sesiones del mismo mes.
- La notificación SNS usa el topic `dashboard-{usuario_id_sanitizado}`.

## Permisos necesarios
- `dynamodb:PutItem` en tabla `deporte`
- `dynamodb:GetItem` en tabla `metas`
- `dynamodb:Scan` en tabla `deporte`
- `sns:CreateTopic`
- `sns:Publish`

## Infraestructura SNS
- Región: `eu-north-1`
- Topic por usuario: `dashboard-{email_sanitizado}`

## Región
- `eu-north-1` (Estocolmo)