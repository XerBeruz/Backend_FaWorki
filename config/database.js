const { PrismaClient } = require('@prisma/client');

// Configuración de Prisma Client
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  errorFormat: 'pretty',
});

// Función para conectar a la base de datos
async function connectDatabase() {
  try {
    // Verificar si DATABASE_URL está configurada
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('username:password')) {
      console.log('⚠️  DATABASE_URL no configurada. Saltando conexión a la base de datos.');
      console.log('📝 Para conectar a Supabase, configura DATABASE_URL en tu archivo .env');
      return;
    }
    
    await prisma.$connect();
    console.log('✅ Conexión a la base de datos establecida correctamente');
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
    console.log('⚠️  Continuando sin conexión a la base de datos...');
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

module.exports = {
  prisma,
  connectDatabase,
  disconnectDatabase
};
