#!/usr/bin/env node

/**
 * Script para probar diferentes configuraciones de conexión en Render
 */

const { PrismaClient } = require('@prisma/client');

async function testConnectionVariants() {
  console.log('🔍 Probando diferentes configuraciones de conexión para Render...\n');
  
  const variants = [
    {
      name: 'Session Pooler (actual)',
      url: 'postgresql://postgres.mlnwcrxqfztxbkmrusdn:FaWorKiSupaBase01@aws-1-us-east-2.pooler.supabase.com:5432/postgres'
    },
    {
      name: 'Direct Connection',
      url: 'postgresql://postgres.mlnwcrxqfztxbkmrusdn:FaWorKiSupaBase01@db.mlnwcrxqfztxbkmrusdn.supabase.co:5432/postgres'
    },
    {
      name: 'Direct Connection con puerto 6543',
      url: 'postgresql://postgres.mlnwcrxqfztxbkmrusdn:FaWorKiSupaBase01@db.mlnwcrxqfztxbkmrusdn.supabase.co:6543/postgres'
    },
    {
      name: 'Session Pooler con puerto 6543',
      url: 'postgresql://postgres.mlnwcrxqfztxbkmrusdn:FaWorKiSupaBase01@aws-1-us-east-2.pooler.supabase.com:6543/postgres'
    }
  ];
  
  for (const variant of variants) {
    console.log(`🧪 Probando: ${variant.name}`);
    console.log(`   URL: ${variant.url.replace(/:[^:]+@/, ':***@')}`);
    
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: variant.url
        }
      },
      log: ['error'],
      errorFormat: 'pretty'
    });
    
    try {
      await prisma.$connect();
      console.log('   ✅ Conexión exitosa');
      
      // Probar consulta
      const result = await prisma.$queryRaw`SELECT 1 as test`;
      console.log('   ✅ Consulta exitosa');
      
      await prisma.$disconnect();
      console.log('   🎉 Esta configuración funciona!\n');
      
      return variant;
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message.split('\n')[0]}`);
      await prisma.$disconnect();
      console.log('');
    }
  }
  
  console.log('❌ Ninguna configuración funcionó');
  return null;
}

// Ejecutar si se llama directamente
if (require.main === module) {
  testConnectionVariants().catch(console.error);
}

module.exports = testConnectionVariants;
