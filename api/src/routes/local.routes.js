const express = require('express');
const router = express.Router();
const {
  crearLocal,
  obtenerLocales,
  obtenerLocalPorId,
  actualizarLocal,
  eliminarLocal,
  toggleLikePublicacion,
  crearComentarioPublicacion
} = require('../controllers/local.controller');

// /api/locales
router.post('/', crearLocal);
router.get('/', obtenerLocales);
router.get('/:id', obtenerLocalPorId);
router.put('/:id', actualizarLocal);
router.delete('/:id', eliminarLocal);

router.post('/:id/publicaciones/:publicacionId/like', toggleLikePublicacion);
router.post('/:id/publicaciones/:publicacionId/comentarios', crearComentarioPublicacion);

module.exports = router;
