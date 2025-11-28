const express = require('express');
const router = express.Router();
const {
  crearLocal,
  obtenerLocales,
  obtenerLocalPorId,
  actualizarLocal,
  eliminarLocal
} = require('../controllers/local.controller');

// /api/locales
router.post('/', crearLocal);
router.get('/', obtenerLocales);
router.get('/:id', obtenerLocalPorId);
router.put('/:id', actualizarLocal);
router.delete('/:id', eliminarLocal);

router.post('/:id/publicaciones/:publicacionId/like', toggleLikePublicacion);

module.exports = router;
