# Lambda Layers

Esta carpeta está reservada para Lambda Layers (capas compartidas entre funciones Lambda) del backend.

## ¿Qué son Lambda Layers?

Las Lambda Layers permiten compartir código y dependencias entre múltiples funciones Lambda sin duplicar archivos en cada despliegue.

## Estado actual

🔧 **Preparado para uso, aún sin layers publicadas**

El backend ya dispone de múltiples Lambdas (gastos, deporte, perfil, suscripciones y resumen global), pero todavía no se ha creado una capa común porque:

- La mayoría de funciones mantienen dependencias simples.
- El código compartido todavía es manejable dentro de cada Lambda.
- Se priorizó estabilizar endpoints y flujos funcionales.

## Cuándo crear una layer en este proyecto

Se recomienda crear una layer cuando ocurra al menos uno de estos casos:

1. **Dependencias pesadas repetidas** en varias Lambdas (por ejemplo librerías externas no incluidas en runtime).
2. **Utilidades comunes consolidadas** (validaciones, respuestas HTTP, serialización de `Decimal`, manejo de errores).
3. **Reducción de mantenimiento** al evitar cambios duplicados en múltiples funciones.

## Estructura recomendada

```
backend/
└── layers/
    └── common_utils/
        └── python/
            └── common/
                ├── responses.py
                ├── validators.py
                ├── encoders.py
                └── aws_helpers.py
```

## Buenas prácticas

- Mantener una layer **pequeña y estable** (solo código realmente reutilizable).
- Versionar la layer (`v1`, `v2`, etc.) para evitar romper Lambdas existentes.
- Evitar incluir `boto3` en layer salvo necesidad específica, ya que AWS Lambda Python ya lo incluye en runtime.
- Documentar qué Lambdas consumen cada versión de la layer.

## Próximo paso sugerido

Primera layer candidata: `common_utils` con utilidades de respuestas JSON/CORS y manejo de `Decimal`, reutilizable por Lambdas de gastos, deporte y resumen global.

## Última actualización
10 Abril 2026