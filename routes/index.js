const express = require('express');
const apiRoutes = require('./api');

const router = express.Router();

// Rutas principales
router.use('/api', apiRoutes);

module.exports = router;
