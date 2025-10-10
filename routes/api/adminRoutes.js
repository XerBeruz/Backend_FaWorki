const express = require('express');
const { 
  obtenerTrabajadoresPendientes, 
  aprobarTrabajador, 
  rechazarTrabajador, 
  obtenerEstadisticas 
} = require('../../controllers/Admin/adminController');

const router = express.Router();

// Rutas de administración
router.get('/trabajadores/pendientes', obtenerTrabajadoresPendientes);
router.put('/trabajadores/:trabajadorId/aprobar', aprobarTrabajador);
router.put('/trabajadores/:trabajadorId/rechazar', rechazarTrabajador);
router.get('/estadisticas', obtenerEstadisticas);

module.exports = router;
