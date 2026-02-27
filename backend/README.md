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
- **Runtime:** Python 3.12

#### 2. listar_gastos
- **Endpoint:** `GET /gastos`
- **Descripción:** Lista todos los gastos guardados
- **Tabla:** `gastos`
- **Runtime:** Python 3.12

### Módulo Deporte

#### 3. crear_entrenamiento
- **Endpoint:** `POST /entrenamientos`
- **Descripción:** Crea un nuevo entrenamiento en DynamoDB
- **Tabla:** `deporte`
- **Runtime:** Python 3.12

#### 4. listar_entrenamientos
- **Endpoint:** `GET /entrenamientos`
- **Descripción:** Lista todos los entrenamientos guardados
- **Tabla:** `deporte`
- **Runtime:** Python 3.12

## Despliegue

Actualmente las Lambdas se despliegan manualmente desde la consola AWS.

En la Semana 12 se implementará CI/CD con GitHub Actions para despliegue automático.

## Permisos IAM

Todas las Lambdas necesitan:
- Política: `AmazonDynamoDBFullAccess`
- Región: `eu-north-1` (Estocolmo)

### Tablas DynamoDB
- `gastos` - Para funciones de gastos
- `deporte` - Para funciones de entrenamientos

## Última actualización
27 Febrero 2026