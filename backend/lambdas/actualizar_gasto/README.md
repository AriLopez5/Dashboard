# Lambda: Actualizar Gasto

Función Lambda que actualiza los datos de un gasto existente en DynamoDB.

## Endpoint
`PUT /gastos/{id}`

## Path Parameters
- `id` (requerido) - ID del gasto a actualizar

## Request Body
```json
{
  "cantidad": 25.50,
  "categoria": "transporte",
  "descripcion": "Gasolina",
  "fecha": "2026-02-24"
}
```

Todos los campos son opcionales. Solo se actualizarán los campos enviados.

## Categorías válidas
- `alimentacion` - Comida, supermercado, restaurantes
- `transporte` - Gasolina, autobús, metro, taxi
- `ocio` - Cine, videojuegos, entretenimiento
- `deporte` - Gimnasio, equipamiento deportivo
- `salud` - Farmacia, médico, consultas
- `otros` - Otros gastos

## Response (200 OK)
```json
{
  "message": "Gasto actualizado exitosamente",
  "gasto": {
    "id": "gasto_abc123def456",
    "cantidad": 25.50,
    "categoria": "transporte",
    "descripcion": "Gasolina",
    "fecha": "2026-02-24",
    "usuario_id": "email@ejemplo.com",
    "created_at": "2026-02-23T10:30:00",
    "updated_at": "2026-02-24T15:45:00"
  }
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
- `dynamodb:UpdateItem` en tabla `gastos`

## Región
- `eu-north-1` (Estocolmo)

## Notas
- Añade automáticamente un campo `updated_at` con el timestamp de la actualización
- No es necesario enviar todos los campos, solo los que se quieren modificar
- El ID en el path debe coincidir con un registro existente