# Arquitectura del Sistema

## Diagrama de Arquitectura
```
┌─────────────┐
│   Usuario   │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  CloudFront     │  (CDN + HTTPS)
│  + S3           │  (Frontend estático)
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  API Gateway    │  (REST API)
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Lambda         │  (Backend serverless)
│  Functions      │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  DynamoDB       │  (Base de datos NoSQL)
└─────────────────┘
```

## Descripción

### Frontend
- Aplicación web estática alojada en S3
- Distribuida globalmente con CloudFront
- HTTPS con certificado SSL/TLS

### Backend
- Funciones Lambda en Python
- Sin servidor (serverless)
- Escalado automático

### Base de datos
- DynamoDB para almacenamiento
- Tablas: gastos, entrenamientos

### API
- API Gateway REST
- Autenticación con API Keys

## Flujo de datos

1. Usuario accede a la web (CloudFront + S3)
2. Frontend realiza peticiones a API Gateway
3. API Gateway invoca funciones Lambda
4. Lambda lee/escribe en DynamoDB
5. Lambda devuelve respuesta a API Gateway
6. Frontend muestra los datos al usuario

## Seguridad

- HTTPS en todo el sistema
- API Keys para autenticación
- IAM Roles con permisos mínimos
- Datos encriptados en DynamoDB