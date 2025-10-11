#!/usr/bin/env node

/**
 * Script para generar la URL de base de datos optimizada para Render
 */

function generateOptimizedDatabaseUrl() {
  const baseUrl = 'postgresql://postgres.mlnwcrxqfztxbkmrusdn:FaWorKiSupaBase01@aws-1-us-east-2.pooler.supabase.com:5432/postgres';
  
  // Parámetros optimizados para Render y Supabase
  const params = new URLSearchParams({
    'sslmode': 'require',
    'connect_timeout': '30',
    'pool_timeout': '30',
    'pool_max': '10',
    'pool_min': '1',
    'statement_timeout': '60000',
    'idle_in_transaction_session_timeout': '300000'
  });
  
  const optimizedUrl = `${baseUrl}?${params.toString()}`;
  
  console.log('🔧 URL de base de datos optimizada para Render:');
  console.log('');
  console.log(optimizedUrl);
  console.log('');
  console.log('📋 Parámetros incluidos:');
  console.log('   - sslmode=require: Requiere SSL');
  console.log('   - connect_timeout=30: Timeout de conexión 30s');
  console.log('   - pool_timeout=30: Timeout de pool 30s');
  console.log('   - pool_max=10: Máximo 10 conexiones');
  console.log('   - pool_min=1: Mínimo 1 conexión');
  console.log('   - statement_timeout=60000: Timeout de consulta 60s');
  console.log('   - idle_in_transaction_session_timeout=300000: Timeout de transacción inactiva 5min');
  console.log('');
  console.log('📝 Copia esta URL y úsala como DATABASE_URL en Render');
  
  return optimizedUrl;
}

// Ejecutar si se llama directamente
if (require.main === module) {
  generateOptimizedDatabaseUrl();
}

module.exports = generateOptimizedDatabaseUrl;
