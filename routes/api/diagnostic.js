const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();

/**
 * Endpoint de diagnóstico para verificar la configuración de la base de datos
 * Solo disponible en desarrollo o con una clave especial
 */
router.get('/database', async (req, res) => {
  try {
    const diagnostic = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database: {
        url_configured: !!process.env.DATABASE_URL,
        url_masked: process.env.DATABASE_URL ? 
          process.env.DATABASE_URL.replace(/:\/\/[^:]+:[^@]+@/, '://***:***@') : 
          'No configurada',
        connection_test: null,
        error: null
      },
      server: {
        port: process.env.PORT,
        node_version: process.version,
        platform: process.platform
      }
    };

    // Probar conexión a la base de datos
    if (process.env.DATABASE_URL) {
      const prisma = new PrismaClient({
        log: ['error'],
        errorFormat: 'pretty'
      });

      try {
        await prisma.$connect();
        await prisma.$queryRaw`SELECT 1 as test`;
        await prisma.$disconnect();
        
        diagnostic.database.connection_test = 'success';
      } catch (error) {
        diagnostic.database.connection_test = 'failed';
        diagnostic.database.error = {
          message: error.message,
          code: error.code,
          meta: error.meta
        };
      }
    } else {
      diagnostic.database.connection_test = 'not_configured';
      diagnostic.database.error = 'DATABASE_URL no configurada';
    }

    res.json({
      success: true,
      diagnostic
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      diagnostic: {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        error: error.message
      }
    });
  }
});

/**
 * Endpoint para verificar variables de entorno (sin mostrar valores sensibles)
 */
router.get('/env', (req, res) => {
  const envVars = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL ? 'Configurada' : 'No configurada',
    JWT_SECRET: process.env.JWT_SECRET ? 'Configurada' : 'No configurada',
    CORS_ORIGINS: process.env.CORS_ORIGINS,
    DB_CONNECTION_TIMEOUT: process.env.DB_CONNECTION_TIMEOUT,
    DB_QUERY_TIMEOUT: process.env.DB_QUERY_TIMEOUT,
    DB_POOL_SIZE: process.env.DB_POOL_SIZE
  };

  res.json({
    success: true,
    environment_variables: envVars
  });
});

module.exports = router;
