const app = require('./app');
const connectDB = require('./config/db');

// Conectar a la base de datos
connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
