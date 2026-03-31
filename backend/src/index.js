/**
 * Solo desarrollo local (`npm start`). En Vercel usa `../server.js`.
 */
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { createApp } = require('./app');

dotenv.config();

const PORT = process.env.PORT || 3001;
const app = createApp();

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
