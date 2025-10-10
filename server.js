const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { connectDatabase } = require('./config/database');
const routes = require('./routes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares de seguridad y logging
app.use(helmet());
// Configurar CORS con variables de entorno
const corsOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
  : ['http://localhost:5173', 'https://faworki.vercel.app'];

app.use(cors({
  origin: corsOrigins,
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de prueba para verificar que el servidor funciona
app.get('/', (req, res) => {
  res.json({
    message: '¡Bienvenido a la API de FaWorKi!',
    version: '1.0.0',
    status: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Ruta de salud del servidor
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Rutas de la aplicación
app.use('/', routes);

// Middleware para manejar rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    message: `La ruta ${req.originalUrl} no existe en esta API`,
    availableRoutes: ['/', '/health', '/api']
  });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: 'Algo salió mal en el servidor'
  });
});

// Iniciar servidor
app.listen(PORT, async () => {
  console.log(`🚀 Servidor FaWorKi ejecutándose en puerto ${PORT}`);
  console.log(`📊 Health check disponible en: http://localhost:${PORT}/health`);
  console.log(`🌐 API disponible en: http://localhost:${PORT}`);
  
  // Conectar a la base de datos
  await connectDatabase();
});

module.exports = app;
