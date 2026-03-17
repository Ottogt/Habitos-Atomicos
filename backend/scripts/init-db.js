/**
 * Crea la base de datos "habitos" en MongoDB Atlas.
 * En MongoDB la base de datos se crea al hacer la primera escritura.
 * Ejecutar una vez: npm run init-db
 */
require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;
const user = process.env.MONGODB_USER;
const pass = process.env.MONGODB_PASS;

if (!uri || !uri.trim()) {
  console.error('Falta MONGODB_URI en .env');
  process.exit(1);
}

const options = { serverSelectionTimeoutMS: 10000 };
if (user && pass) {
  options.user = user;
  options.pass = pass;
}
const cleanUri = user && pass
  ? uri.replace(/^mongodb(\+srv)?:\/\/[^:]+:[^@]+@/, 'mongodb$1://').trim()
  : uri.trim();

async function initDb() {
  try {
    await mongoose.connect(cleanUri, options);
    const db = mongoose.connection.db;
    // La primera escritura crea la base de datos en Atlas
    await db.collection('_init').insertOne({ created: new Date(), init: true });
    await db.collection('_init').drop();
    console.log('Base de datos "habitos" creada correctamente en Atlas.');
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

initDb();
