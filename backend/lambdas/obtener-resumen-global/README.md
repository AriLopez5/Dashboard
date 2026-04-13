# Lambda: Obtener Resumen Global

Función Lambda que recupera un resumen consolidado de todos los usuarios del sistema, incluyendo estadísticas de gastos y entrenamientos.

## Endpoint
`GET /resumen-global`

## Query Parameters
- Opcionales para ranking por rango de fechas:
  - `fecha_inicio` (formato `YYYY-MM-DD`)
  - `fecha_fin` (formato `YYYY-MM-DD`)

Ejemplo:
`GET /resumen-global?fecha_inicio=2026-04-01&fecha_fin=2026-04-12`

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
  },
  "rankings_por_mes": {
    "2026-04": {
      "gastos": [
        {
          "usuario_id": "user@example.com",
          "nombre": "Usuario Ejemplo",
          "foto_url": "https://...",
          "valor": 320.75
        }
      ],
      "deporte": [
        {
          "usuario_id": "user@example.com",
          "nombre": "Usuario Ejemplo",
          "foto_url": "https://...",
          "valor": 240
        }
      ]
    }
  },
  "ranking_por_rango": {
    "fecha_inicio": "2026-04-01",
    "fecha_fin": "2026-04-12",
    "gastos": [
      {
        "usuario_id": "user@example.com",
        "nombre": "Usuario Ejemplo",
        "foto_url": "https://...",
        "valor": 120.5
      }
    ],
    "deporte": [
      {
        "usuario_id": "user@example.com",
        "nombre": "Usuario Ejemplo",
        "foto_url": "https://...",
        "valor": 95
      }
    ]
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
- Genera rankings mensuales (`rankings_por_mes`) para gastos y deporte (top 5 por mes)
- Permite generar ranking por rango de fechas (`ranking_por_rango`) cuando se envían `fecha_inicio` y `fecha_fin`
- Utiliza `DecimalEncoder` para serializar valores Decimal de DynamoDB
