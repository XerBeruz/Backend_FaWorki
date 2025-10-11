#!/usr/bin/env node

/**
 * Script para verificar la configuración de Supabase
 * Uso: node scripts/verify-supabase.js
 */

const https = require('https');
const { PrismaClient } = require('@prisma/client');

async function verifySupabase() {
  console.log('🔍 Verificando configuración de Supabase...\n');
  
  // Verificar variables de entorno
  console.log('📋 Variables de entorno:');
  console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'no definido'}`);
  console.log(`   DATABASE_URL: ${process.env.DATABASE_URL ? 'configurada' : '❌ NO CONFIGURADA'}`);
  console.log(`   SUPABASE_URL: ${process.env.SUPABASE_URL || '❌ NO CONFIGURADA'}`);
  console.log(`   SUPABASE_ANON_KEY: ${process.env.SUPABASE_ANON_KEY ? 'configurada' : '❌ NO CONFIGURADA'}`);
  
  if (!process.env.DATABASE_URL) {
    console.log('\n❌ DATABASE_URL no configurada. No se puede continuar.');
    return;
  }
  
  // Verificar formato de DATABASE_URL
  console.log('\n🔍 Verificando formato de DATABASE_URL...');
  const urlPattern = /^postgresql:\/\/postgres\.([^:]+):([^@]+)@aws-1-us-east-2\.pooler\.supabase\.com:5432\/postgres$/;
  const match = process.env.DATABASE_URL.match(urlPattern);
  
  if (!match) {
    console.log('❌ Formato de DATABASE_URL incorrecto');
    console.log('📝 Formato esperado: postgresql://postgres.[ref]:[password]@aws-1-us-east-2.pooler.supabase.com:5432/postgres');
    return;
  }
  
  const [, ref, password] = match;
  console.log(`✅ Formato correcto`);
  console.log(`   Referencia: ${ref}`);
  console.log(`   Contraseña: ${password.length > 0 ? 'configurada' : '❌ vacía'}`);
  
  if (password.length === 0) {
    console.log('\n❌ La contraseña está vacía. Verifica tu configuración.');
    return;
  }
  
  // Probar conexión a Supabase
  console.log('\n🌐 Probando conexión a Supabase...');
  
  if (process.env.SUPABASE_URL) {
    try {
      await testSupabaseConnection(process.env.SUPABASE_URL);
      console.log('✅ Conexión a Supabase exitosa');
    } catch (error) {
      console.log('❌ Error al conectar con Supabase:', error.message);
    }
  }
  
  // Probar conexión a la base de datos
  console.log('\n🗄️  Probando conexión a la base de datos...');
  
  const prisma = new PrismaClient({
    log: ['error'],
    errorFormat: 'pretty'
  });
  
  try {
    await prisma.$connect();
    console.log('✅ Conexión a la base de datos exitosa');
    
    // Probar consulta
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Consulta de prueba exitosa');
    
    // Verificar tablas
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('📋 Tablas encontradas:', tables.map(t => t.table_name));
    
    await prisma.$disconnect();
    
  } catch (error) {
    console.error('❌ Error de conexión a la base de datos:', error.message);
    
    if (error.message.includes('Can\'t reach database server')) {
      console.log('\n🔧 Posibles soluciones:');
      console.log('   1. Verifica que la contraseña sea correcta');
      console.log('   2. Asegúrate de que el proyecto de Supabase esté activo');
      console.log('   3. Verifica que estés usando el session pooler');
      console.log('   4. Revisa la configuración de red');
    }
  }
}

function testSupabaseConnection(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      if (res.statusCode === 200) {
        resolve();
      } else {
        reject(new Error(`HTTP ${res.statusCode}`));
      }
    });
    
    req.on('error', reject);
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

// Ejecutar si se llama directamente
if (require.main === module) {
  require('dotenv').config();
  verifySupabase().catch(console.error);
}

module.exports = verifySupabase;
