# Backend - Funciones Lambda

Este directorio contiene todas las funciones Lambda del proyecto.

## Estructura
```
backend/
└── lambdas/
    ├── crear_gasto/
    │   ├── lambda_function.py
    │   └── README.md
    ├── listar_gastos/
    │   ├── lambda_function.py
    │   └── README.md
    ├── crear_entrenamiento/
    │   ├── lambda_function.py
    │   └── README.md
    └── listar_entrenamientos/
        ├── lambda_function.py
        └── README.md
```

## Funciones Lambda

### Módulo Gastos

#### 1. crear_gasto
- **Endpoint:** `POST /gastos`
- **Descripción:** Crea un nuevo gasto en DynamoDB
- **Tabla:** `gastos`

#### 2. listar_gastos
- **Endpoint:** `GET /gastos`
- **Descripción:** Lista todos los gastos guardados
- **Tabla:** `gastos`

#### 3. actualizar_gasto ✨ NUEVO
- **Endpoint:** `PUT /gastos/{id}`
- **Descripción:** Actualiza un gasto existente
- **Tabla:** `gastos`

#### 4. eliminar_gasto ✨ NUEVO
- **Endpoint:** `DELETE /gastos/{id}`
- **Descripción:** Elimina un gasto
- **Tabla:** `gastos`

### Módulo Deporte

#### 5. crear_entrenamiento
- **Endpoint:** `POST /entrenamientos`
- **Descripción:** Crea un nuevo entrenamiento en DynamoDB
- **Tabla:** `deporte`

#### 6. listar_entrenamientos
- **Endpoint:** `GET /entrenamientos`
- **Descripción:** Lista todos los entrenamientos guardados
- **Tabla:** `deporte`

#### 7. actualizar_entrenamiento ✨ NUEVO
- **Endpoint:** `PUT /entrenamientos/{id}`
- **Descripción:** Actualiza un entrenamiento existente
- **Tabla:** `deporte`

#### 8. eliminar_entrenamiento ✨ NUEVO
- **Endpoint:** `DELETE /entrenamientos/{id}`
- **Descripción:** Elimina un entrenamiento
- **Tabla:** `deporte`

## Última actualización
03 Febrero 2026 - CRUD completo implementado