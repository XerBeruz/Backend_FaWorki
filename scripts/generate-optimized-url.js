#!/usr/bin/env node

/**
 * Script para generar URL optimizada para evitar desconexiones prematuras
 */

function generateOptimizedUrl() {
  const baseUrl = 'postgresql://postgres.mlnwcrxqfztxbkmrusdn:FaWorKiSupaBase01@aws-1-us-east-2.pooler.supabase.com:5432/postgres';
  
  // Parámetros específicos para evitar desconexiones prematuras
  const params = new URLSearchParams({
    'sslmode': 'require',
    'connect_timeout': '60',           // Aumentar timeout de conexión
    'pool_timeout': '60',              // Aumentar timeout de pool
    'pool_max': '5',                   // Reducir conexiones máximas
    'pool_min': '1',                   // Mantener 1 conexión activa
    'statement_timeout': '120000',     // 2 minutos para consultas
    'idle_in_transaction_session_timeout': '600000', // 10 minutos
    'tcp_keepalives_idle': '600',      // Keep-alive TCP cada 10 minutos
    'tcp_keepalives_interval': '30',   // Intervalo de keep-alive TCP
    'tcp_keepalives_count': '3',       // Intentos de keep-alive TCP
    'application_name': 'faworki-backend' // Identificar la aplicación
  });
  
  const optimizedUrl = `${baseUrl}?${params.toString()}`;
  
  console.log('🔧 URL optimizada para evitar desconexiones prematuras:');
  console.log('');
  console.log(optimizedUrl);
  console.log('');
  console.log('📋 Parámetros incluidos:');
  console.log('   - sslmode=require: Requiere SSL');
  console.log('   - connect_timeout=60: Timeout de conexión 60s');
  console.log('   - pool_timeout=60: Timeout de pool 60s');
  console.log('   - pool_max=5: Máximo 5 conexiones (reducido)');
  console.log('   - pool_min=1: Mínimo 1 conexión activa');
  console.log('   - statement_timeout=120000: Timeout de consulta 2min');
  console.log('   - idle_in_transaction_session_timeout=600000: Timeout transacción 10min');
  console.log('   - tcp_keepalives_idle=600: Keep-alive TCP cada 10min');
  console.log('   - tcp_keepalives_interval=30: Intervalo keep-alive 30s');
  console.log('   - tcp_keepalives_count=3: 3 intentos de keep-alive');
  console.log('   - application_name=faworki-backend: Identificar app');
  console.log('');
  console.log('📝 Copia esta URL y úsala como DATABASE_URL en Render');
  
  return optimizedUrl;
}

// Ejecutar si se llama directamente
if (require.main === module) {
  generateOptimizedUrl();
}

module.exports = generateOptimizedUrl;
