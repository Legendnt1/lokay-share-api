const Local = require('../models/local.model');

// POST /api/locales
exports.crearLocal = async (req, res) => {
  try {
    const nuevoLocal = new Local(req.body);
    await nuevoLocal.save();
    res.status(201).json(nuevoLocal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET /api/locales
exports.obtenerLocales = async (req, res) => {
  try {
    const locales = await Local.find().populate('id_propietario');
    res.status(200).json(locales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/locales/:id
exports.obtenerLocalPorId = async (req, res) => {
  try {
    const local = await Local.findById(req.params.id)
      .populate('id_propietario')
      .populate('reseñas.id_usuario');
      
    if (!local) return res.status(404).json({ message: 'Local no encontrado' });
    res.status(200).json(local);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/locales/:id
exports.actualizarLocal = async (req, res) => {
  try {
    const local = await Local.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!local) return res.status(404).json({ message: 'Local no encontrado' });
    res.status(200).json(local);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /api/locales/:id
exports.eliminarLocal = async (req, res) => {
  try {
    const local = await Local.findByIdAndDelete(req.params.id);
    if (!local) return res.status(404).json({ message: 'Local no encontrado' });
    res.status(200).json({ message: 'Local eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/locales/:id/publicaciones/:publicacionId/like
exports.toggleLikePublicacion = async (req, res) => {
  try {
    const { id, publicacionId } = req.params;
    const { userId } = req.body; // id del usuario logeado

    if (!userId) {
      return res.status(400).json({ message: 'userId es requerido' });
    }

    // Buscar el local
    const local = await Local.findById(id);
    if (!local) {
      return res.status(404).json({ message: 'Local no encontrado' });
    }

    // Buscar la publicación dentro del array de publicaciones
    const publicacion = local.publicaciones.id(publicacionId);
    if (!publicacion) {
      return res.status(404).json({ message: 'Publicación no encontrada' });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Verificar si el usuario ya dio like
    const yaDioLike = publicacion.likedBy.some((uid) => uid.equals(userObjectId));

    if (yaDioLike) {
      // QUITAR like
      publicacion.likedBy = publicacion.likedBy.filter(
        (uid) => !uid.equals(userObjectId)
      );
    } else {
      // AGREGAR like
      publicacion.likedBy.push(userObjectId);
    }

    // Actualizar el contador de likes en base a likedBy
    publicacion.likes = publicacion.likedBy.length;

    await local.save();

    // Opcional: devolver solo la publicación actualizada
    res.status(200).json({
      message: yaDioLike ? 'Like removido' : 'Like agregado',
      likes: publicacion.likes,
      likedBy: publicacion.likedBy
    });
  } catch (error) {
    console.error('Error al actualizar likes:', error);
    res.status(500).json({ message: error.message });
  }
};
