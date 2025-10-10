# Backend FaWorKi

Backend API para la aplicación FaWorKi - Plataforma de trabajo freelance.

## 🚀 Tecnologías

- **Express.js**: Framework web para Node.js
- **Prisma**: ORM para base de datos PostgreSQL
- **Supabase**: Base de datos PostgreSQL en la nube
- **Nodemon**: Herramienta de desarrollo para reinicio automático
- **Dotenv**: Gestión de variables de entorno

## 📦 Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
# Copiar el archivo de ejemplo
cp env.example .env

# Editar .env con tus credenciales de Supabase
```

3. Configurar la base de datos:
```bash
# Generar el cliente de Prisma
npm run db:generate

# Sincronizar el esquema con la base de datos
npm run db:push
```

## 🏃‍♂️ Ejecución

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

## 📊 Endpoints disponibles

- `GET /` - Información de la API
- `GET /health` - Estado del servidor

## 🗄️ Base de datos

El proyecto usa Prisma como ORM para conectar con Supabase (PostgreSQL).

### Comandos útiles:
```bash
# Ver la base de datos en el navegador
npm run db:studio

# Generar cliente de Prisma
npm run db:generate

# Aplicar cambios del esquema
npm run db:push
```

## 🔧 Configuración

### Variables de entorno necesarias:

```env
PORT=3001
NODE_ENV=development
DATABASE_URL="postgresql://username:password@host:port/database?schema=public"
```

## 📁 Estructura del proyecto

```
Backend_FaWorki/
├── config/
│   └── database.js          # Configuración de Prisma
├── prisma/
│   └── schema.prisma        # Esquema de la base de datos
├── server.js                # Servidor principal
├── package.json
├── env.example              # Ejemplo de variables de entorno
└── README.md
```

## 🚧 Próximas funcionalidades

- [ ] Autenticación de usuarios
- [ ] Registro de usuarios
- [ ] Gestión de perfiles
- [ ] Sistema de proyectos
- [ ] API de búsqueda
- [ ] Sistema de notificaciones

