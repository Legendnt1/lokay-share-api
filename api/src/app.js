const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Carga variables de entorno (para desarrollo local)
dotenv.config();

const app = express();

// Middlewares
app.use(cors()); // Permite peticiones de otros dominios
app.use(express.json()); // Parsea body de peticiones a JSON

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API de Lokay-Share funcionando!');
});

// Enrutador principal
app.use('/api', require('./routes'));

module.exports = app;
