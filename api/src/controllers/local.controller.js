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
