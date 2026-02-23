# Backend - Funciones Lambda

Este directorio contiene todas las funciones Lambda del proyecto.

## Estructura
```
backend/
├── lambdas/
│   ├── gastos/
│   │   ├── crear_gasto.py
│   │   ├── listar_gastos.py
│   │   ├── actualizar_gasto.py
│   │   └── eliminar_gasto.py
│   └── entrenamientos/
│       ├── crear_entrenamiento.py
│       └── listar_entrenamientos.py
└── layers/
    └── dependencias_comunes/
```

## Tecnologías

- Python 3.12
- boto3 (SDK de AWS)
- AWS Lambda Runtime

## Estado

🚧 En desarrollo
---------------------------------------------------------------------------------------------------
# Backend - Funciones Lambda

Este directorio contiene todas las funciones Lambda del proyecto.

## Estructura
```
backend/
└── lambdas/
    ├── crear_gasto/
    │   ├── lambda_function.py
    │   └── README.md
    └── listar_gastos/
        ├── lambda_function.py
        └── README.md
```

## Funciones Lambda

### 1. crear_gasto
- **Endpoint:** `POST /gastos`
- **Descripción:** Crea un nuevo gasto en DynamoDB
- **Runtime:** Python 3.12

### 2. listar_gastos
- **Endpoint:** `GET /gastos`
- **Descripción:** Lista todos los gastos guardados
- **Runtime:** Python 3.12

## Despliegue

Actualmente las Lambdas se despliegan manualmente desde la consola AWS.

En la Semana 12 se implementará CI/CD con GitHub Actions para despliegue automático.

## Permisos IAM

Todas las Lambdas necesitan:
- Política: `AmazonDynamoDBFullAccess`
- Acceso a tabla: `gastos`
- Región: `eu-north-1` (Estocolmo)

## Última actualización
Semana 2 - Febrero 2026