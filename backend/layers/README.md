# Lambda Layers

Esta carpeta está reservada para Lambda Layers (capas compartidas entre funciones Lambda).

## ¿Qué son Lambda Layers?

Las Lambda Layers permiten compartir código, librerías o dependencias entre múltiples funciones Lambda sin duplicar archivos.

## Casos de uso comunes:

1. **Librerías externas** - Compartir librerías Python como `requests`, `pandas`, `pillow`
2. **Código común** - Funciones de utilidad usadas por varias Lambdas
3. **Configuración compartida** - Constantes, validadores, formateadores

## Estado actual

🔜 **Pendiente de implementación**

Actualmente el proyecto tiene pocas funciones Lambda y el código compartido es mínimo. Se evaluará la necesidad de crear layers cuando el número de funciones Lambda aumente.

## Estructura propuesta (futuro)
```
layers/
└── common_utils/
    └── python/
        └── utils/
            ├── validators.py
            ├── encoders.py
            └── formatters.py
```

## Última actualización
Semana 2 - Febrero 2026