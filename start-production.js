#!/usr/bin/env node

/**
 * Script de inicio para producción
 * Maneja la inicialización de la base de datos de forma segura
 */

const { PrismaClient } = require('@prisma/client');

async function startProduction() {
  console.log('🚀 Iniciando FaWorKi Backend en modo producción...\n');
  
  // Verificar variables de entorno críticas
  const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Variables de entorno faltantes:', missingVars.join(', '));
    console.log('📝 Configura las siguientes variables en Render:');
    missingVars.forEach(varName => {
      console.log(`   - ${varName}`);
    });
    process.exit(1);
  }
  
  console.log('✅ Variables de entorno verificadas');
  
  // Probar conexión a la base de datos
  console.log('🔌 Probando conexión a la base de datos...');
  
  const prisma = new PrismaClient({
    log: ['error'],
    errorFormat: 'pretty'
  });
  
  try {
    await prisma.$connect();
    console.log('✅ Conexión a la base de datos exitosa');
    
    // Probar una consulta simple
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Base de datos funcionando correctamente');
    
    await prisma.$disconnect();
    
  } catch (error) {
    console.error('❌ Error de conexión a la base de datos:', error.message);
    console.log('⚠️  Continuando sin base de datos...');
  }
  
  // Iniciar el servidor
  console.log('🌐 Iniciando servidor web...');
  require('./server.js');
}

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  console.error('❌ Error no capturado:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promesa rechazada no manejada:', reason);
  process.exit(1);
});

// Ejecutar
startProduction().catch(console.error);
