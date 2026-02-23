# Lambda: Listar Gastos

Función Lambda que recupera todos los gastos de DynamoDB.

## Endpoint
`GET /gastos`

## Query Parameters (opcionales)
- `categoria` - Filtrar por categoría (ej: `?categoria=alimentacion`)

## Response (200 OK)
```json
{
  "total_gastos": 5,
  "total_cantidad": 127.50,
  "gastos": [
    {
      "id": "gasto_xxxxx",
      "fecha": "2026-02-23",
      "cantidad": 25.50,
      "categoria": "transporte",
      "descripcion": "Gasolina"
    },
    ...
  ]
}
```

## Permisos necesarios
- `dynamodb:Scan` en tabla `gastos`