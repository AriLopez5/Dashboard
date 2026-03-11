# Lambda: Obtener Resumen Global

Función Lambda que recupera un resumen consolidado de todos los usuarios del sistema, incluyendo estadísticas de gastos y entrenamientos.

## Endpoint
`GET /resumen-global`

## Query Parameters
Ninguno (obtiene todos los usuarios automáticamente)

## Response (200 OK)
```json
{
  "usuarios": [
    {
      "usuario_id": "user@example.com",
      "nombre": "Usuario Ejemplo",
      "gastos_total": 1250.50,
      "gastos_cantidad": 45,
      "deporte_minutos": 1800,
      "deporte_sesiones": 12
    },
    ...
  ],
  "totales": {
    "num_usuarios": 5,
    "gastos_total": 5432.75,
    "gastos_registros": 123,
    "deporte_minutos": 8500,
    "deporte_sesiones": 67
  }
}
```

## Permisos necesarios
- `dynamodb:Scan` en tabla `gastos`
- `dynamodb:Scan` en tabla `deporte`
- `dynamodb:Scan` en tabla `perfiles`

## Detalles de implementación
- Obtiene nombres de usuario desde la tabla `perfiles`
- Agrupa gastos y entrenamientos por usuario
- Calcula totales globales del sistema
- Utiliza `DecimalEncoder` para serializar valores Decimal de DynamoDB
