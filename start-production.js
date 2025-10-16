#!/usr/bin/env node

/**
 * Script de inicio para producción
 * Maneja la inicialización de la base de datos de forma segura
 */


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
  
  console.log('🔌 Verificando configuración de base de datos...');
  
  if (process.env.DATABASE_URL) {
    console.log('✅ DATABASE_URL configurada correctamente');
  } else {
    console.error('❌ DATABASE_URL no configurada');
    process.exit(1);
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
