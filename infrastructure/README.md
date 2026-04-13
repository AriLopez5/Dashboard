# Infraestructura como Código (IaC)

Esta carpeta está preparada para alojar la infraestructura como código del proyecto (Terraform o CloudFormation).

## Estado actual

✅ Infraestructura desplegada en AWS, pero **sin plantillas IaC versionadas aún** en esta carpeta.

## Recursos activos del proyecto

- API Gateway (`q5cdb6cw0d`)
- Funciones Lambda (módulos gastos, deporte, metas, perfil, comunidad y resumen global)
- DynamoDB (`gastos`, `deporte`, `perfiles`, `metas`)
- S3 frontend (`tfg-dashboard`)
- S3 fotos de perfil (`tfg-dashboard-fotos`)
- CloudFront (`EGQ2UR6H5V9UY`)
- Cognito User Pool (`eu-north-1_sY2obhHwM`)
- SNS (topics `dashboard-*` para suscripciones)

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

## Última actualización
13 Abril 2026