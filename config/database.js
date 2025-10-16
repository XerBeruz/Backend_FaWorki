const { getPrismaClient, connectOptimized, disconnectOptimized } = require('./connection-pool');

// Obtener instancia optimizada de Prisma
const prisma = getPrismaClient();

// Funciones optimizadas usando el pool de conexiones
const connectDatabase = () => connectOptimized(prisma);
const disconnectDatabase = () => disconnectOptimized(prisma);

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
