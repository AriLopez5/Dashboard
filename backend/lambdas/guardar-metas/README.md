# Lambda: Guardar Metas

Función Lambda que guarda o actualiza metas mensuales de un usuario en DynamoDB.

## Endpoint
`POST /metas`

## Request Body
```json
{
	"usuario_id": "email@ejemplo.com",
	"mes": "2026-03",
	"presupuesto_gastos": 300,
	"meta_sesiones": 12
}
```

## Campos requeridos
- `usuario_id`
- `mes` (formato `YYYY-MM`)

## Campos opcionales
- `presupuesto_gastos` (número)
- `meta_sesiones` (número)

## Response (200 OK)
```json
{
	"message": "Metas guardadas correctamente"
}
```

## Response (400 Bad Request)
```json
{
	"error": "Faltan campos: usuario_id y mes"
}
```

## Response (error)
```json
{
	"error": "Descripción del error"
}
```

## Notas
- Convierte los valores numéricos a `Decimal` antes de guardar en DynamoDB.
- Usa `put_item`, por lo que crea o sobrescribe el registro para la clave compuesta (`usuario_id`, `mes`).
- Incluye soporte CORS y responde `OPTIONS`.

## Tabla DynamoDB
- Tabla: `metas`
- Partition key: `usuario_id` (String)
- Sort key: `mes` (String)

## Permisos necesarios
- `dynamodb:PutItem` en tabla `metas`

## Región
- `eu-north-1` (Estocolmo)
