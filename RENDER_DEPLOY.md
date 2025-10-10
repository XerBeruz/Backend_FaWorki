# Guía de Despliegue en Render - FaWorKi Backend

## Configuración del Servicio

### 1. Crear el Servicio
1. Ve a [render.com](https://render.com)
2. Haz clic en "New +" > "Web Service"
3. Conecta tu repositorio de GitHub
4. Selecciona el repositorio `Backend_FaWorki`

### 2. Configuración del Servicio
- **Name**: `faworki-backend`
- **Environment**: `Node`
- **Region**: `Oregon (US West)`
- **Branch**: `main`
- **Root Directory**: `Backend_FaWorki`
- **Build Command**: `pnpm install --frozen-lockfile && pnpm run build`
- **Start Command**: `pnpm start`

### 3. Variables de Entorno Requeridas

Configura las siguientes variables en el dashboard de Render:

```env
# Base de datos (REQUERIDA)
DATABASE_URL=postgresql://postgres.mlnwcrxqfztxbkmrusdn:TU_PASSWORD@aws-1-us-east-2.pooler.supabase.com:5432/postgres

# Servidor
NODE_ENV=production
PORT=3001

# Supabase (REQUERIDAS)
SUPABASE_URL=https://mlnwcrxqfztxbkmrusdn.supabase.co
SUPABASE_ANON_KEY=tu_anon_key_completa

# JWT (REQUERIDA)
JWT_SECRET=faworki_jwt_secret_2024_very_secure_key

# CORS
CORS_ORIGINS=https://faworki.vercel.app,http://localhost:5173

# Configuración de base de datos
DB_CONNECTION_TIMEOUT=10000
DB_QUERY_TIMEOUT=30000
DB_POOL_SIZE=10
```

### 4. Obtener la Contraseña de Supabase

1. Ve a tu proyecto en [supabase.com](https://supabase.com)
2. Ve a **Settings** > **Database**
3. Busca la sección **Connection string**
4. Selecciona **Session pooler**
5. Copia la contraseña de la URL
6. Reemplaza `TU_PASSWORD` en `DATABASE_URL` con esta contraseña

### 5. Desplegar

1. Haz clic en "Create Web Service"
2. Render comenzará a construir y desplegar tu aplicación
3. El proceso tomará unos minutos

## Solución de Problemas

### Error: "Can't reach database server"
- Verifica que `DATABASE_URL` esté configurada correctamente
- Asegúrate de usar el **Session pooler** de Supabase
- Verifica que el proyecto de Supabase esté activo

### Error: "Build failed"
- Verifica que todas las variables de entorno estén configuradas
- Revisa los logs de build para más detalles

### Error: "Service failed to start"
- Verifica que `JWT_SECRET` esté configurada
- Revisa los logs de inicio para más detalles

## Verificación del Despliegue

Una vez desplegado, puedes verificar que funciona:

1. **Health Check**: `https://tu-servicio.onrender.com/health`
2. **API Root**: `https://tu-servicio.onrender.com/`
3. **Registro de Trabajador**: `https://tu-servicio.onrender.com/api/auth/register/worker`

## Monitoreo

- Los logs están disponibles en el dashboard de Render
- El servicio se reiniciará automáticamente si falla
- Render proporciona métricas básicas de uso

## Actualizaciones

Para actualizar el servicio:
1. Haz push de los cambios a la rama `main`
2. Render detectará los cambios automáticamente
3. Iniciará un nuevo build y despliegue
