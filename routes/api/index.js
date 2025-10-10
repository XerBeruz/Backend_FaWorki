const express = require('express');
const authRoutes = require('./authRoutes');
const adminRoutes = require('./adminRoutes');

const router = express.Router();

// Rutas de la API
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);

// Ruta de información de la API
router.get('/', (req, res) => {
  res.json({
    message: 'API de FaWorKi',
    version: '1.0.0',
    endpoints: {
      auth: {
        'POST /api/auth/register/worker': 'Registrar trabajador',
        'POST /api/auth/login': 'Iniciar sesión',
        'GET /api/auth/profile/:userId': 'Obtener perfil de usuario'
      },
      admin: {
        'GET /api/admin/trabajadores/pendientes': 'Obtener trabajadores pendientes',
        'PUT /api/admin/trabajadores/:id/aprobar': 'Aprobar trabajador',
        'PUT /api/admin/trabajadores/:id/rechazar': 'Rechazar trabajador',
        'GET /api/admin/estadisticas': 'Obtener estadísticas'
      }
    }
  });
});

module.exports = router;
