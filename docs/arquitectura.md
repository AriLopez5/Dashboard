# Arquitectura del Sistema

## Diagrama de Arquitectura
```
┌─────────────┐
│   Usuario   │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  Cognito        │  (Autenticación + sesión)
└──────┬──────────┘
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
┌──────────────────────────────┐
│  DynamoDB       │  S3 Fotos  │
│  (gastos,       │  (avatares │
│   deporte,      │   perfil)  │
│   perfiles)     │            │
└──────────────────────────────┘
```

## Descripción

### Frontend
- Aplicación React alojada en S3 (`tfg-dashboard`)
- Distribuida globalmente con CloudFront
- HTTPS con certificado SSL/TLS
- CI/CD automático con GitHub Actions

### Autenticación
- Amazon Cognito User Pool (`eu-north-1_sY2obhHwM`)
- Login con email y contraseña
- Sesión persistente con tokens JWT
- Rutas privadas protegidas en React

### Backend
- Funciones Lambda en Python 3.12
- Sin servidor (serverless)
- Escalado automático

### Base de datos
- DynamoDB para almacenamiento NoSQL
- Tablas: `gastos`, `deporte`, `perfiles`

### Almacenamiento de archivos
- S3 bucket `tfg-dashboard-fotos` para fotos de perfil
- Acceso público de lectura
- Subida via Lambda en base64

### API
- API Gateway REST
- CORS habilitado en todos los endpoints

## Flujo de datos

1. Usuario accede a la web (CloudFront + S3)
2. Si no está autenticado, se redirige al Login (Cognito)
3. Frontend realiza peticiones a API Gateway
4. API Gateway invoca funciones Lambda
5. Lambda lee/escribe en DynamoDB o S3
6. Lambda devuelve respuesta a API Gateway
7. Frontend muestra los datos al usuario

## Seguridad

- HTTPS en todo el sistema
- Autenticación con Amazon Cognito
- IAM Roles con permisos mínimos
- Datos encriptados en DynamoDB
- CORS configurado en API Gateway y S3

## 🌐 API Endpoints

**Base URL:** `https://q5cdb6cw0d.execute-api.eu-north-1.amazonaws.com/prod`

### Gastos
- `GET /gastos` - Listar todos los gastos
- `POST /gastos` - Crear nuevo gasto
- `DELETE /gastos/{id}` - Eliminar gasto

### Deporte
- `GET /entrenamientos` - Listar todos los entrenamientos
- `POST /entrenamientos` - Crear nuevo entrenamiento
- `DELETE /entrenamientos/{id}` - Eliminar entrenamiento

### Perfil
- `GET /perfil` - Obtener datos del perfil
- `POST /perfil` - Guardar/actualizar perfil
- `POST /foto` - Subir foto de perfil a S3

## 🗂️ Infraestructura AWS

| Servicio | Nombre / ID | Uso |
|---|---|---|
| S3 | `tfg-dashboard` | Frontend estático |
| S3 | `tfg-dashboard-fotos` | Fotos de perfil |
| CloudFront | `EGQ2UR6H5V9UY` | CDN frontend |
| Cognito | `eu-north-1_sY2obhHwM` | Autenticación |
| API Gateway | `q5cdb6cw0d` | REST API |
| DynamoDB | `gastos`, `deporte`, `perfiles` | Base de datos |

## 🌍 Región
- `eu-north-1` (Estocolmo)