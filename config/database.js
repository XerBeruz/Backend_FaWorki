const { PrismaClient } = require('@prisma/client');

// Configuración de Prisma Client optimizada para Render
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  errorFormat: 'pretty',
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  // Configuración optimizada para Render y Supabase
  __internal: {
    engine: {
      connectTimeout: 30000, // 30 segundos
      queryTimeout: 60000,   // 60 segundos
    }
  }
});

// Función para conectar a la base de datos
async function connectDatabase() {
  try {
    // Verificar si DATABASE_URL está configurada
    if (!process.env.DATABASE_URL) {
      console.log('⚠️  DATABASE_URL no configurada. Saltando conexión a la base de datos.');
      console.log('📝 Para conectar a Supabase, configura DATABASE_URL en tu archivo .env');
      return false;
    }

    // Verificar si la URL parece válida
    if (process.env.DATABASE_URL.includes('username:password') || 
        process.env.DATABASE_URL.includes('your-project')) {
      console.log('⚠️  DATABASE_URL contiene valores de ejemplo. Saltando conexión a la base de datos.');
      console.log('📝 Configura una URL válida de Supabase en tu archivo .env');
      return false;
    }
    
    await prisma.$connect();
    console.log('✅ Conexión a la base de datos establecida correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error.message);
    
    // Información específica sobre errores de conexión
    if (error.message.includes('Can\'t reach database server')) {
      console.log('🔍 Posibles soluciones:');
      console.log('   1. Verifica que la URL de la base de datos sea correcta');
      console.log('   2. Asegúrate de que el proyecto de Supabase esté activo');
      console.log('   3. Verifica que las credenciales sean correctas');
      console.log('   4. Revisa la configuración de red/firewall');
    }
    
    console.log('⚠️  Continuando sin conexión a la base de datos...');
    return false;
  }
}

// Función para desconectar de la base de datos
async function disconnectDatabase() {
  try {
    await prisma.$disconnect();
    console.log('✅ Desconexión de la base de datos exitosa');
  } catch (error) {
    console.error('❌ Error al desconectar de la base de datos:', error);
  }
}

// Manejo de cierre graceful
process.on('beforeExit', async () => {
  await disconnectDatabase();
});

process.on('SIGINT', async () => {
  await disconnectDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectDatabase();
  process.exit(0);
});

// Exportar la instancia de Prisma
module.exports = {
  prisma,
  connectDatabase,
  disconnectDatabase
};
