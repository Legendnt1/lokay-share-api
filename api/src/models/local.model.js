const mongoose = require('mongoose');
const { Schema } = mongoose;

// Sub-esquema para Dirección
const DireccionSchema = new Schema({
  pais: { type: String },
  region: { type: String },
  ciudad: { type: String },
  distrito: { type: String },
  calle: { type: String },
  referencia: { type: String }
}, { _id: false }); // No queremos IDs duplicados para la dirección

// Sub-esquema para Comentarios (dentro de Publicaciones)
const ComentarioSchema = new Schema({
  id_usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
  usuario_nombre: { type: String, required: true },
  texto: { type: String, required: true },
  fecha: { type: Date, default: Date.now }
});

// Sub-esquema para Publicaciones
const PublicacionSchema = new Schema({
  fecha: { type: Date, default: Date.now },
  texto: { type: String, required: true },
  url_imagen: { type: String },
  likes: { type: Number, default: 0 },
  comentarios: [ComentarioSchema]
});

// Sub-esquema para Reseñas
const ReseñaSchema = new Schema({
  id_usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
  usuario_nombre: { type: String, required: true },
  calificacion: { type: Number, min: 1, max: 5, required: true },
  texto: { type: String },
  fecha: { type: Date, default: Date.now }
});

// Esquema Principal de Local
const LocalSchema = new Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  lokayShopUrl: {
    type: String,
    match: [/^(https?):\/\/[^\s$.?#].[^\s]*$/i, 'Por favor, introduce una URL válida.']
  },
  direccion: DireccionSchema,
  horarios: { type: String },
  id_propietario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
  reseñas: [ReseñaSchema],
  publicaciones: [PublicacionSchema]
}, { timestamps: true }); // timestamps añade createdAt y updatedAt

module.exports = mongoose.model('Local', LocalSchema);
