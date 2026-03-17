/**
 * Crea el usuario administrador (admin@admin1 / admin1) si no existe.
 * Ejecutar una vez: npm run seed-admin
 */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');

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

const ADMIN_EMAIL = 'admin@admin1';
const ADMIN_PASSWORD = 'admin1';

async function seedAdmin() {
  try {
    await mongoose.connect(cleanUri, options);
    const existing = await User.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      console.log('El usuario admin@admin1 ya existe.');
      await mongoose.disconnect();
      return;
    }
    const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await User.create({
      email: ADMIN_EMAIL,
      password: hashed,
      name: 'Administrador',
    });
    console.log('Usuario admin creado.');
    console.log('  Email: admin@admin1');
    console.log('  Contraseña: admin1');
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seedAdmin();
