const mongoose = require('mongoose');

// La URI se toma de la variable de entorno inyectada por Docker Compose
const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB conectado exitosamente (en el contenedor).');
  } catch (err) {
    console.error('Error al conectar con MongoDB:', err.message);
    // Salir del proceso con error
    process.exit(1);
  }
};

module.exports = connectDB;
