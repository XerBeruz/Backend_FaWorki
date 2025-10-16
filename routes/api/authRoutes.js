const express = require('express');
const { registrarTrabajador, iniciarSesion, obtenerPerfil } = require('../../controllers/Auth/AuthController');
const { validateWorkerRegistration, validateLogin } = require('../../middleware/validation');

const router = express.Router();

// Rutas de autenticación
router.post('/register/worker', validateWorkerRegistration, registrarTrabajador);
router.post('/login', validateLogin, iniciarSesion);
router.get('/profile/:userId', obtenerPerfil);

module.exports = router;
