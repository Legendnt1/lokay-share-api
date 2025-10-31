const mongoose = require('mongoose');
const { Schema } = mongoose;

const UsuarioSchema = new Schema({
  nombre: { type: String, required: true },
  usuario: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  telefono: { type: String },
  foto_perfil: { type: String },
  rol: {
    type: String,
    enum: ['propietario', 'cliente', 'admin'],
    default: 'cliente'
  },
  fecha_registro: { type: Date, default: Date.now },
  locales_propios: [
    { type: Schema.Types.ObjectId, ref: 'Local' }
  ],
  ultima_conexion: { type: Date }
}, { timestamps: true }); // timestamps añade createdAt y updatedAt

module.exports = mongoose.model('Usuario', UsuarioSchema);
