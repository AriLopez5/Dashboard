# Backend - Funciones Lambda

Este directorio contiene todas las funciones Lambda del proyecto.

## Estructura
```
backend/
├── lambdas/
│   ├── crear-gasto/
│   ├── listar-gasto/
│   ├── actualizar_gasto/
│   ├── eliminar_gasto/
│   ├── crear_entrenamiento/
│   ├── listar_entrenamientos/
│   ├── actualizar_entrenamiento/
│   ├── eliminar_entrenamiento/
│   ├── guardar-perfil/
│   ├── obtener-perfil/
│   ├── subir-foto-perfil/
│   └── obtener-resumen-global/
└── layers/
```

## Funciones Lambda

### Módulo Gastos

#### 1. crear-gasto
- **Endpoint:** `POST /gastos`
- **Descripción:** Crea un nuevo gasto en DynamoDB
- **Tabla:** `gastos`

#### 2. listar-gasto
- **Endpoint:** `GET /gastos`
- **Descripción:** Lista todos los gastos guardados (con filtros opcionales)
- **Tabla:** `gastos`

#### 3. actualizar_gasto
- **Endpoint:** `PUT /gastos/{id}`
- **Descripción:** Actualiza un gasto existente
- **Tabla:** `gastos`

#### 4. eliminar_gasto
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

#### 7. actualizar_entrenamiento
- **Endpoint:** `PUT /entrenamientos/{id}`
- **Descripción:** Actualiza un entrenamiento existente
- **Tabla:** `deporte`

#### 8. eliminar_entrenamiento
- **Endpoint:** `DELETE /entrenamientos/{id}`
- **Descripción:** Elimina un entrenamiento
- **Tabla:** `deporte`

### Módulo Perfil ✨ NUEVO

#### 9. guardar-perfil
- **Endpoint:** `POST /perfil`
- **Descripción:** Guarda o actualiza el perfil de usuario
- **Tabla:** `perfiles`

#### 10. obtener-perfil
- **Endpoint:** `GET /perfil`
- **Descripción:** Obtiene el perfil de un usuario
- **Tabla:** `perfiles`

#### 11. subir-foto-perfil
- **Endpoint:** `POST /perfil/foto`
- **Descripción:** Sube una foto de perfil a S3 y actualiza el perfil
- **Tabla:** `perfiles` + S3 Bucket

### Módulo Global ✨ NUEVO

#### 12. obtener-resumen-global
- **Endpoint:** `GET /resumen-global`
- **Descripción:** Obtiene resumen consolidado de todos los usuarios (gastos y entrenamientos)
- **Tablas:** `gastos`, `deporte`, `perfiles`

## API Base URL
```
https://q5cdb6cw0d.execute-api.eu-north-1.amazonaws.com/prod
```

## Última actualización
11 Marzo 2026 - Sistema completo con perfiles y resumen global