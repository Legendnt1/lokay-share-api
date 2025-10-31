const express = require('express');
const router = express.Router();

// Rutas
router.use('/usuarios', require('./usuario.routes'));
router.use('/locales', require('./local.routes'));

module.exports = router;
