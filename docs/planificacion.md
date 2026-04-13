# Planificación del TFG

## Calendario

**Inicio:** Febrero 2026  
**Entrega:** 18 de mayo de 2026  
**Duración:** ~14 semanas  

## Fases del proyecto

### Fase 1: Preparación ✅
- [x] Cuenta AWS
- [x] Herramientas instaladas (Node.js, Python, AWS CLI)
- [x] Repositorio GitHub
- [x] CI/CD con GitHub Actions

### Fase 2: Infraestructura AWS ✅
- [x] Tablas DynamoDB (`gastos`, `deporte`, `perfiles`, `metas`)
- [x] Funciones Lambda en Python
- [x] API Gateway REST con CORS
- [x] S3 + CloudFront para frontend
- [x] S3 bucket para fotos de perfil
- [x] Amazon SNS para suscripciones por email

### Fase 3: Frontend — Módulo Gastos ✅
- [x] Formulario añadir gastos
- [x] Lista de gastos con categorías
- [x] Eliminar gastos
- [x] Exportar a CSV
- [x] Gráficas por categoría

### Fase 4: Frontend — Módulo Deporte ✅
- [x] Formulario añadir entrenamientos
- [x] Lista de entrenamientos
- [x] Eliminar entrenamientos
- [x] Exportar a CSV
- [x] Gráficas de progreso

### Fase 5: Dashboard y comparativas ✅
- [x] Resumen general
- [x] Comparativa mensual gastos vs deporte
- [x] Selector de mes
- [x] Resumen global multiusuario

### Fase 5.1: Metas mensuales ✅
- [x] Guardado de metas de presupuesto mensual
- [x] Guardado de meta mensual de sesiones
- [x] Consulta de metas por usuario y mes

### Fase 5.2: Comunidad y notificaciones ✅
- [x] Suscripción de usuario por email (SNS)
- [x] Creación/reutilización de topic por usuario

### Fase 6: Autenticación ✅
- [x] Amazon Cognito User Pool
- [x] Login con email y contraseña
- [x] Rutas privadas protegidas
- [x] Sesión persistente

### Fase 7: Perfil de usuario ✅
- [x] Página de perfil
- [x] Nombre/apodo guardado en DynamoDB
- [x] Foto de perfil subida a S3
- [x] Color de fondo personalizable
- [x] Tema oscuro
- [x] Estadísticas de uso

### Fase 8: UX y diseño ✅
- [x] Paleta de colores pastel
- [x] Tipografía DM Sans
- [x] Sidebar responsive con menú hamburguesa
- [x] Diseño móvil adaptado

### Fase 9: Seguridad y ajustes finales
- [x] HTTPS en todo el sistema
- [x] CORS configurado
- [x] IAM roles con permisos mínimos
- [x] Expiración de sesión por inactividad (5 min)

### Fase 10: Documentación y defensa
- [x] Documentación técnica de backend (README por Lambda)
- [ ] Memoria del TFG
- [ ] Presentación

## 📅 Fechas clave

| Hito | Fecha |
|---|---|
| Inicio del proyecto | Febrero 2026 |
| Backend funcional | Febrero 2026 |
| Frontend completo | Marzo 2026 |
| Autenticación y perfil | Marzo 2026 |
| Metas y comunidad | Abril 2026 |
| Documentación | Abril - Mayo 2026 |
| **Entrega TFG** | **18 de mayo de 2026** |