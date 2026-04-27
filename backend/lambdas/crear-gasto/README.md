# Lambda: Crear Gasto

Función Lambda que crea un nuevo gasto en DynamoDB y, si el usuario tiene una meta mensual configurada, verifica si se supera el presupuesto para enviar una notificación SNS.

## Endpoint
`POST /gastos`

## Request Body
```json
{
  "cantidad": 15.50,
  "categoria": "alimentacion",
  "descripcion": "Menu del dia",
  "fecha": "2026-02-23"  // Opcional, usa fecha actual si no se especifica
}
```

## Campos obligatorios
- `cantidad`
- `categoria`

## Campos opcionales
- `descripcion` (si no se envía, se guarda como cadena vacía)
- `fecha` (formato `YYYY-MM-DD`; si no se envía, usa la fecha actual)
- `usuario_id` (si no se envía, usa `default_user`)

## Comportamiento adicional
- Guarda el gasto en la tabla `gastos` con un `id` generado con el prefijo `gasto_`.
- Convierte `cantidad` a `Decimal` antes de persistirlo en DynamoDB.
- Después de guardar, busca la meta mensual en la tabla `metas` usando `usuario_id` y el mes de la fecha.
- Si existe `presupuesto_gastos` y el total mensual supera o iguala el presupuesto, crea o reutiliza un topic SNS del usuario y envía una notificación.

## Response (201 Created)
```json
{
  "message": "Gasto creado exitosamente",
  "gasto": {
    "id": "gasto_xxxxx",
    "fecha": "2026-02-23",
    "cantidad": "15.50",
    "categoria": "alimentacion",
    "descripcion": "Menu del dia",
    "usuario_id": "email@ejemplo.com",
    "created_at": "2026-02-23T14:30:00"
  }
}
```

## Response (400 Bad Request)
```json
{
  "error": "Faltan campos obligatorios: cantidad y categoria"
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
- La respuesta serializa valores `Decimal` usando `default=str`, por lo que `cantidad` puede aparecer como cadena.
- Si existe una meta mensual, la validación del presupuesto se hace sobre los gastos del mismo mes.
- La notificación SNS usa el topic `dashboard-{usuario_id_sanitizado}`.

## Permisos necesarios
- `dynamodb:PutItem` en tabla `gastos`
- `dynamodb:GetItem` en tabla `metas`
- `dynamodb:Scan` en tabla `gastos`
- `sns:CreateTopic`
- `sns:Publish`

## Infraestructura SNS
- Región: `eu-north-1`
- Topic por usuario: `dashboard-{email_sanitizado}`