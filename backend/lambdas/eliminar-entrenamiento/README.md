# Lambda: Eliminar Entrenamiento

Función Lambda que elimina un entrenamiento específico de DynamoDB.

## Endpoint
`DELETE /entrenamientos/{id}`

## Path Parameters
- `id` (requerido) - ID del entrenamiento a eliminar

## Ejemplo de Request
```bash
DELETE /entrenamientos/entrenamiento_xyz789abc123
```

## Response (200 OK)
```json
{
  "message": "Entrenamiento eliminado exitosamente",
  "id": "entrenamiento_xyz789abc123"
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
- `dynamodb:DeleteItem` en tabla `deporte`

## Región
- `eu-north-1` (Estocolmo)

## Notas
- La operación solicita confirmación en el frontend antes de ejecutarse
- Una vez eliminado, el entrenamiento no se puede recuperar
- El ID debe coincidir exactamente con un registro existente en DynamoDB