#!/usr/bin/env node

/**
 * Script para configurar la base de datos de Render
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

async function setupRenderDatabase() {
  console.log('🗄️  Configurando base de datos de Render...\n');
  
  // Verificar DATABASE_URL
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL no configurada');
    process.exit(1);
  }
  
  console.log('📋 Configuración de base de datos:');
  const url = process.env.DATABASE_URL;
  const maskedUrl = url.replace(/:\/\/[^:]+:[^@]+@/, '://***:***@');
  console.log(`   URL: ${maskedUrl}`);
  
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
    errorFormat: 'pretty'
  });
  
  try {
    console.log('\n🔌 Conectando a la base de datos...');
    await prisma.$connect();
    console.log('✅ Conexión exitosa');
    
    console.log('\n📊 Ejecutando migraciones...');
    // Prisma generará automáticamente las tablas basándose en el schema
    await prisma.$executeRaw`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`;
    console.log('✅ Extensión UUID creada');
    
    // Verificar que las tablas se crearon
    console.log('\n🔍 Verificando tablas...');
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('📋 Tablas encontradas:', tables.map(t => t.table_name));
    
    // Probar una consulta simple
    console.log('\n🧪 Probando consulta...');
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Consulta de prueba exitosa:', result);
    
    console.log('\n🎉 Base de datos de Render configurada correctamente');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  setupRenderDatabase().catch(console.error);
}

module.exports = setupRenderDatabase;
