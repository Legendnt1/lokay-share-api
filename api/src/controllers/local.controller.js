const mongoose = require('mongoose');
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
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'userId es requerido' });
    }

    const local = await Local.findById(id);
    if (!local) {
      return res.status(404).json({ message: 'Local no encontrado' });
    }

    const publicacion = local.publicaciones.id(publicacionId);
    if (!publicacion) {
      return res.status(404).json({ message: 'Publicación no encontrada' });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    publicacion.likedBy = publicacion.likedBy || [];

    const yaDioLike = publicacion.likedBy.some((uid) =>
      uid.equals(userObjectId)
    );

    if (yaDioLike) {
      publicacion.likedBy = publicacion.likedBy.filter(
        (uid) => !uid.equals(userObjectId)
      );
    } else {
      publicacion.likedBy.push(userObjectId);
    }

    publicacion.likes = publicacion.likedBy.length;

    await local.save();

    return res.status(200).json({
      message: yaDioLike ? 'Like removido' : 'Like agregado',
      likes: publicacion.likes,
      likedBy: publicacion.likedBy,
    });
  } catch (error) {
    console.error('Error al actualizar likes:', error);
    return res.status(500).json({ message: error.message });
  }
};

// POST /api/locales/:id/publicaciones/:publicacionId/comentarios
exports.crearComentarioPublicacion = async (req, res) => {
  try {
    const { id, publicacionId } = req.params;
    const { userId, usuarioNombre, texto } = req.body;

    if (!userId || !usuarioNombre || !texto) {
      return res
        .status(400)
        .json({ message: 'userId, usuarioNombre y texto son requeridos' });
    }

    const local = await Local.findById(id);
    if (!local) {
      return res.status(404).json({ message: 'Local no encontrado' });
    }

    const publicacion = local.publicaciones.id(publicacionId);
    if (!publicacion) {
      return res.status(404).json({ message: 'Publicación no encontrada' });
    }

    // push al array de comentarios (Mongoose castea el string a ObjectId)
    publicacion.comentarios.push({
      id_usuario: userId,
      usuario_nombre: usuarioNombre,
      texto,
      // fecha se pone sola por el default del schema
    });

    await local.save();

    // último comentario agregado
    const nuevoComentario =
      publicacion.comentarios[publicacion.comentarios.length - 1];

    return res.status(201).json(nuevoComentario);
  } catch (error) {
    console.error('Error al crear comentario:', error);
    return res.status(500).json({ message: error.message });
  }
};

// DELETE /api/locales/:id/publicaciones/:publicacionId/comentarios/:comentarioId
exports.eliminarComentarioPublicacion = async (req, res) => {
  try {
    const { id, publicacionId, comentarioId } = req.params;

    const local = await Local.findById(id);
    if (!local) {
      return res.status(404).json({ message: 'Local no encontrado' });
    }

    const publicacion = local.publicaciones.id(publicacionId);
    if (!publicacion) {
      return res.status(404).json({ message: 'Publicación no encontrada' });
    }

    const comentario = publicacion.comentarios.id(comentarioId);
    if (!comentario) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }

    // Eliminar el subdocumento
    comentario.deleteOne(); // o publicacion.comentarios.id(comentarioId).deleteOne()

    await local.save();

    return res.status(200).json({ message: 'Comentario eliminado' });
  } catch (error) {
    console.error('Error al eliminar comentario:', error);
    return res.status(500).json({ message: error.message });
  }
};

// POST /api/locales/:id/publicaciones/:publicacionId/comentarios
exports.crearComentarioPublicacion = async (req, res) => {
  try {
    const { id, publicacionId } = req.params;
    const { userId, usuarioNombre, texto } = req.body;

    if (!userId || !usuarioNombre || !texto) {
      return res.status(400).json({
        message: "userId, usuarioNombre y texto son requeridos",
      });
    }

    const local = await Local.findById(id);
    if (!local) {
      return res.status(404).json({ message: "Local no encontrado" });
    }

    const publicacion = local.publicaciones.id(publicacionId);
    if (!publicacion) {
      return res.status(404).json({ message: "Publicación no encontrada" });
    }

    publicacion.comentarios.push({
      id_usuario: userId,
      usuario_nombre: usuarioNombre,
      texto,
      // fecha se genera sola por el schema
    });

    await local.save();

    const nuevoComentario =
      publicacion.comentarios[publicacion.comentarios.length - 1];

    res.status(201).json(nuevoComentario);
  } catch (error) {
    console.error("Error creando comentario:", error);
    res.status(500).json({ message: error.message });
  }
};

// POST /api/locales/:id/resenas
exports.crearResena = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, usuarioNombre, calificacion, texto } = req.body;

    if (!userId || !usuarioNombre || !calificacion) {
      return res.status(400).json({
        message: "userId, usuarioNombre y calificacion son requeridos",
      });
    }

    const local = await Local.findById(id);
    if (!local) {
      return res.status(404).json({ message: "Local no encontrado" });
    }

    // Crear reseña
    local.reseñas.push({
      id_usuario: userId,
      usuario_nombre: usuarioNombre,
      calificacion,
      texto,
      // fecha se genera con default del schema
    });

    await local.save();

    const nuevaResena = local.reseñas[local.reseñas.length - 1];

    res.status(201).json(nuevaResena);
  } catch (error) {
    console.error("Error creando reseña:", error);
    res.status(500).json({ message: error.message });
  }
};

// POST /api/locales/:id/publicaciones
exports.crearPublicacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { texto, url_imagen } = req.body;

    if (!texto) {
      return res.status(400).json({ message: "El texto de la publicación es requerido" });
    }

    const local = await Local.findById(id);
    if (!local) {
      return res.status(404).json({ message: "Local no encontrado" });
    }

    local.publicaciones.push({
      texto,
      url_imagen: url_imagen || null,
      likes: 0,
      likedBy: [],
      comentarios: [],
    });

    await local.save();

    const nuevaPublicacion =
      local.publicaciones[local.publicaciones.length - 1];

    return res.status(201).json(nuevaPublicacion);
  } catch (error) {
    console.error("Error creando publicación:", error);
    return res.status(500).json({ message: error.message });
  }
};