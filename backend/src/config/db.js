const mongoose = require('mongoose');

/**
 * Devuelve URI y opciones para Mongoose.
 * Si MONGODB_USER y MONGODB_PASS están en .env, se pasan en opciones para
 * no tener que codificar la contraseña en la URI.
 */
function getMongoConfig() {
  const uri = process.env.MONGODB_URI;
  const user = process.env.MONGODB_USER;
  const pass = process.env.MONGODB_PASS;

  if (!uri || typeof uri !== 'string' || !uri.trim()) {
    throw new Error(
      'Falta MONGODB_URI en .env. Añade la connection string de MongoDB Atlas.'
    );
  }

  const options = {
    serverSelectionTimeoutMS: 10000,
    retryWrites: true,
  };

  if (user && pass) {
    options.user = user;
    options.pass = pass;
    // Quitar user:pass de la URI si está para no duplicar (evita caracteres raros)
    const cleanUri = uri.replace(
      /^mongodb(\+srv)?:\/\/[^:]+:[^@]+@/,
      'mongodb$1://'
    );
    return { uri: cleanUri.trim(), options };
  }

  return { uri: uri.trim(), options };
}

const connectDB = async (retries = 3) => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  const { uri, options } = getMongoConfig();

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await mongoose.connect(uri, options);
      console.log('MongoDB conectado correctamente');
      return;
    } catch (error) {
      console.error(
        `Intento ${attempt}/${retries} - Error de conexión:`,
        error.message
      );
      if (attempt < retries) {
        const delay = 2000;
        console.log(`Reintentando en ${delay / 1000}s...`);
        await new Promise((r) => setTimeout(r, delay));
      } else {
        console.error(
          'El servidor arrancará igual; se usará almacenamiento en memoria hasta que MongoDB esté disponible.'
        );
        console.error(
          'Comprueba en Atlas: Network Access (IP permitida), usuario y contraseña correctos.'
        );
        throw error;
      }
    }
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB desconectado');
});

mongoose.connection.on('error', (err) => {
  console.error('Error de Mongoose:', err.message);
});

module.exports = connectDB;
