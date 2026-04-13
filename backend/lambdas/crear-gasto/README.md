# Lambda: Crear Gasto

Función Lambda que crea un nuevo gasto en DynamoDB.

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

## Response (201 Created)
```json
{
  "message": "Gasto creado exitosamente",
  "gasto": {
    "id": "gasto_xxxxx",
    "fecha": "2026-02-23",
    "cantidad": 15.50,
    "categoria": "alimentacion",
    "descripcion": "Menu del dia",
    "usuario_id": "email@ejemplo.com",
    "created_at": "2026-02-23T14:30:00"
  }
}
```

## Notas
- `usuario_id` se asocia al usuario autenticado (email de Cognito en el flujo actual).

## Permisos necesarios
- `dynamodb:PutItem` en tabla `gastos`