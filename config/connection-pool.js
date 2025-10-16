/**
 * Configuración optimizada del pool de conexiones para PostgreSQL en Render
 * Reduce significativamente los logs de conexión/desconexión
 */

const { PrismaClient } = require('@prisma/client');

// Configuración optimizada para producción en Render
const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    errorFormat: 'pretty',
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    },
    // Configuración optimizada para reducir conexiones frecuentes
    __internal: {
      engine: {
        connectTimeout: 10000,  // 10 segundos
        queryTimeout: 30000,    // 30 segundos
        // Configuración de pool de conexiones
        connectionLimit: 5,     // Máximo 5 conexiones simultáneas
        idleTimeout: 300000,    // 5 minutos de inactividad antes de cerrar
        acquireTimeout: 10000,  // 10 segundos para adquirir conexión
      }
    }
  });
};

// Singleton para evitar múltiples instancias
let prismaInstance = null;

const getPrismaClient = () => {
  if (!prismaInstance) {
    prismaInstance = createPrismaClient();
  }
  return prismaInstance;
};

// Función para mantener conexión activa de forma más eficiente
let keepAliveInterval = null;
let isConnected = false;

const startOptimizedKeepAlive = (prisma) => {
  if (keepAliveInterval || isConnected) return;
  
  keepAliveInterval = setInterval(async () => {
    try {
      // Solo hacer ping si no hay conexión activa
      if (!isConnected) {
        await prisma.$queryRaw`SELECT 1`;
        isConnected = true;
        console.log('💓 Conexión de base de datos activa');
      }
    } catch (error) {
      isConnected = false;
      console.error('❌ Error en keep-alive:', error.message);
    }
  }, 600000); // Ping cada 10 minutos (600000ms)
};

const stopOptimizedKeepAlive = () => {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
    keepAliveInterval = null;
    isConnected = false;
  }
};

// Función de conexión optimizada
const connectOptimized = async (prisma) => {
  try {
    if (!process.env.DATABASE_URL) {
      console.log('⚠️  DATABASE_URL no configurada. Saltando conexión a la base de datos.');
      return false;
    }

    // Verificar si la URL parece válida
    if (process.env.DATABASE_URL.includes('username:password') || 
        process.env.DATABASE_URL.includes('your-project')) {
      console.log('⚠️  DATABASE_URL contiene valores de ejemplo. Saltando conexión a la base de datos.');
      return false;
    }
    
    await prisma.$connect();
    isConnected = true;
    console.log('✅ Conexión a la base de datos establecida correctamente');
    
    // Iniciar keep-alive optimizado
    startOptimizedKeepAlive(prisma);
    
    return true;
  } catch (error) {
    isConnected = false;
    console.error('❌ Error al conectar con la base de datos:', error.message);
    return false;
  }
};

// Función de desconexión optimizada
const disconnectOptimized = async (prisma) => {
  try {
    stopOptimizedKeepAlive();
    await prisma.$disconnect();
    isConnected = false;
    console.log('✅ Desconexión de la base de datos exitosa');
  } catch (error) {
    console.error('❌ Error al desconectar de la base de datos:', error);
  }
};

module.exports = {
  getPrismaClient,
  connectOptimized,
  disconnectOptimized,
  startOptimizedKeepAlive,
  stopOptimizedKeepAlive
};
