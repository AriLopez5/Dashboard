# Infraestructura como Código (IaC)

Esta carpeta está preparada para alojar la infraestructura como código del proyecto (Terraform o CloudFormation).

## Estado actual

✅ Infraestructura completamente desplegada en AWS, pero **sin plantillas IaC versionadas aún** en esta carpeta.

🔔 **Notificaciones automáticas activas**: Lambdas de crear-gasto y crear-entrenamiento envían notificaciones SNS cuando se alcanzan o superan metas.

## Recursos activos del proyecto

- API Gateway (`q5cdb6cw0d`)
- Funciones Lambda (15 funciones en Python 3.12: módulos gastos, deporte, metas, perfil, comunidad y resumen global)
  - Validación de campos obligatorios en todas las funciones
  - Manejo automático de Decimal en DynamoDB
  - Notificaciones SNS inteligentes cuando se cumplen metas
- DynamoDB (`gastos`, `deporte`, `perfiles`, `metas`)
- S3 frontend (`tfg-dashboard`)
- S3 fotos de perfil (`tfg-dashboard-fotos`)
- CloudFront (`EGQ2UR6H5V9UY`)
- Cognito User Pool (`eu-north-1_sY2obhHwM`)
- SNS (topics `dashboard-*` para suscripciones y notificaciones automáticas)
  - Topic por usuario: `dashboard-{email_sanitizado}`
  - Suscripción por email con confirmación requerida
  - Notificaciones automáticas de presupuesto y metas

## Estructura recomendada (siguiente paso)

```text
infrastructure/
├── terraform/
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   └── environments/
│       ├── dev.tfvars
│       └── prod.tfvars
└── README.md
```

## Objetivo

- Versionar la infraestructura para despliegues repetibles.
- Reducir configuración manual en consola AWS.
- Facilitar auditoría y trazabilidad de cambios.

## CI/CD actual

- Frontend: workflow `.github/workflows/deploy.yml` (build React + subida a S3 + invalidación CloudFront).
- Backend: workflow `.github/workflows/deploy-backend.yml` (despliegue de Lambdas en `backend/lambdas`).

### Despliegue backend (GitHub Actions)

El workflow `deploy-backend.yml`:

- Se ejecuta en `push` a `main` cuando hay cambios en `backend/lambdas/**`.
- Permite ejecución manual (`workflow_dispatch`) con dos opciones:
	- `only_function`: desplegar solo una Lambda (nombre de carpeta).
	- `dry_run`: validar sin desplegar.
- Valida automáticamente campos obligatorios en request/response de cada Lambda.
- Establece permisos IAM correctos para DynamoDB, S3, SNS y CloudWatch Logs.

### Configuración necesaria en GitHub

Secrets:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

Variable opcional de repositorio:

- `LAMBDA_FUNCTION_PREFIX` (si en AWS tus funciones no se llaman exactamente igual que la carpeta)
	- Ejemplo: si la función es `dashboard-crear-gasto`, usa `LAMBDA_FUNCTION_PREFIX=dashboard-`

### Permisos IAM necesarios

Cada función Lambda requiere permisos específicos:

**DynamoDB**:
- `dynamodb:PutItem`, `dynamodb:UpdateItem`, `dynamodb:DeleteItem`, `dynamodb:GetItem`, `dynamodb:Scan`

**S3**:
- `s3:PutObject` (para fotos de perfil en `tfg-dashboard-fotos`)

**SNS**:
- `sns:CreateTopic`, `sns:Subscribe`, `sns:Publish` (para notificaciones automáticas)

**CloudWatch Logs**:
- `logs:CreateLogGroup`, `logs:CreateLogStream`, `logs:PutLogEvents`

## Última actualización
Abril 2026