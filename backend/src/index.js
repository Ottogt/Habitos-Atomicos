const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { createApp } = require('./app');

dotenv.config();

const app = createApp();

// Vercel: una sola función serverless que exporta la app (ver guía Express en Vercel).
// Local: conectar Mongo y escuchar puerto.
if (process.env.VERCEL) {
  module.exports = app;
} else {
  const PORT = process.env.PORT || 3001;
  (async () => {
    try {
      await connectDB();
    } catch (err) {
      console.error('MongoDB no disponible:', err.message);
    }
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })().catch((err) => {
    console.error('Error al iniciar el servidor:', err);
    process.exit(1);
  });
}
