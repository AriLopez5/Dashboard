# Lambda: Eliminar Gasto

Función Lambda que elimina un gasto específico de DynamoDB.

## Endpoint
`DELETE /gastos/{id}`

## Path Parameters
- `id` (requerido) - ID del gasto a eliminar

## Ejemplo de Request
```bash
DELETE /gastos/gasto_abc123def456
```

## Response (200 OK)
```json
{
  "message": "Gasto eliminado exitosamente",
  "id": "gasto_abc123def456"
}
```

## Response (400 Bad Request)
```json
{
  "error": "ID del gasto no proporcionado"
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
- `dynamodb:DeleteItem` en tabla `gastos`

## Región
- `eu-north-1` (Estocolmo)

## Notas
- La operación solicita confirmación en el frontend antes de ejecutarse
- Una vez eliminado, el gasto no se puede recuperar
- El ID debe coincidir exactamente con un registro existente en DynamoDB