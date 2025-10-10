#!/usr/bin/env node

/**
 * Script para configurar la conexión a la base de datos
 * Uso: node scripts/setup-database.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupDatabase() {
  console.log('🔧 Configuración de Base de Datos - FaWorKi\n');
  
  console.log('📋 Información necesaria:');
  console.log('   - Tu contraseña de Supabase');
  console.log('   - El archivo se actualizará automáticamente\n');
  
  const password = await question('🔑 Ingresa tu contraseña de Supabase: ');
  
  if (!password || password.trim() === '') {
    console.log('❌ Contraseña no puede estar vacía');
    process.exit(1);
  }
  
  // URL de conexión con la contraseña
  const databaseUrl = `postgresql://postgres.mlnwcrxqfztxbkmrusdn:${password}@aws-1-us-east-2.pooler.supabase.com:5432/postgres`;
  
  console.log('\n📝 Actualizando archivos de configuración...');
  
  // Actualizar env.production
  const envProductionPath = path.join(__dirname, '..', 'env.production');
  let envProduction = fs.readFileSync(envProductionPath, 'utf8');
  
  envProduction = envProduction.replace(
    /DATABASE_URL="postgresql:\/\/postgres\.mlnwcrxqfztxbkmrusdn:\[YOUR-PASSWORD\]@aws-1-us-east-2\.pooler\.supabase\.com:5432\/postgres"/,
    `DATABASE_URL="${databaseUrl}"`
  );
  
  fs.writeFileSync(envProductionPath, envProduction);
  console.log('✅ env.production actualizado');
  
  // Crear archivo .env para desarrollo
  const envPath = path.join(__dirname, '..', '.env');
  const envContent = `# Configuración del servidor para desarrollo
PORT=3001
NODE_ENV=development

# Base de datos Supabase - Session Pooler
DATABASE_URL="${databaseUrl}"

# Variables de Supabase
SUPABASE_URL="https://mlnwcrxqfztxbkmrusdn.supabase.co"
SUPABASE_ANON_KEY="eyJhbGci0iJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3Mi0iJzdXE"

# JWT Secret
JWT_SECRET="faworki_jwt_secret_2024_very_secure_key"

# CORS Origins
CORS_ORIGINS="http://localhost:5173,http://localhost:3000,https://faworki.vercel.app"

# Configuración de conexión de base de datos
DB_CONNECTION_TIMEOUT=10000
DB_QUERY_TIMEOUT=30000
DB_POOL_SIZE=10
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env creado para desarrollo');
  
  console.log('\n🧪 Probando conexión...');
  
  // Probar conexión
  try {
    require('dotenv').config();
    const { PrismaClient } = require('@prisma/client');
    
    const prisma = new PrismaClient({
      log: ['error'],
      errorFormat: 'pretty'
    });
    
    await prisma.$connect();
    console.log('✅ Conexión exitosa a la base de datos');
    
    // Probar una consulta simple
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Consulta de prueba exitosa');
    
    await prisma.$disconnect();
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    console.log('\n🔍 Posibles soluciones:');
    console.log('   1. Verifica que la contraseña sea correcta');
    console.log('   2. Asegúrate de que el proyecto de Supabase esté activo');
    console.log('   3. Verifica que estés usando el session pooler correcto');
  }
  
  console.log('\n🎉 Configuración completada');
  console.log('📁 Archivos actualizados:');
  console.log('   - env.production');
  console.log('   - .env (desarrollo)');
  
  rl.close();
}

// Ejecutar si se llama directamente
if (require.main === module) {
  setupDatabase().catch(console.error);
}

module.exports = setupDatabase;
