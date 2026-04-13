# Lambda: Obtener Metas

Función Lambda que obtiene las metas mensuales de un usuario desde DynamoDB.

## Endpoint
`GET /metas`

## Query Parameters
- `usuario_id` (requerido)
- `mes` (requerido, formato `YYYY-MM`)

Ejemplo:
`GET /metas?usuario_id=email@ejemplo.com&mes=2026-03`

## Response (200 OK)
```json
{
	"meta": {
		"usuario_id": "email@ejemplo.com",
		"mes": "2026-03",
		"presupuesto_gastos": 300,
		"meta_sesiones": 12
	}
}
```

## Response (200 OK, sin registro)
```json
{
	"meta": null
}
```

## Response (400 Bad Request)
```json
{
	"error": "Faltan parámetros: usuario_id y mes"
}
```

## Response (error)
```json
{
	"error": "Descripción del error"
}
```

## Notas
- Consulta por clave compuesta (`usuario_id`, `mes`) mediante `get_item`.
- Usa `DecimalEncoder` para serializar valores numéricos de DynamoDB en JSON.
- Incluye soporte CORS y responde `OPTIONS`.

## Tabla DynamoDB
- Tabla: `metas`
- Partition key: `usuario_id` (String)
- Sort key: `mes` (String)

## Permisos necesarios
- `dynamodb:GetItem` en tabla `metas`

## Región
- `eu-north-1` (Estocolmo)
