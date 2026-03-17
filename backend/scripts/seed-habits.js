/**
 * Borra los hábitos existentes y crea 5 hábitos aleatorios (objetivo 66 días).
 * Ejecutar: npm run seed-habits
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Habit = require('../src/models/Habit');
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
const cleanUri =
  user && pass ? uri.replace(/^mongodb(\+srv)?:\/\/[^:]+:[^@]+@/, 'mongodb$1://').trim() : uri.trim();

const HABITOS_ALEATORIOS = [
  { name: 'Leer 20 minutos', description: 'Cada noche antes de dormir', icon: 'book' },
  { name: 'Hacer ejercicio', description: 'Al menos 30 min al día', icon: 'exercise' },
  { name: 'Meditar 10 minutos', description: 'Por la mañana al despertar', icon: 'meditate' },
  { name: 'Escribir en el diario', description: 'Tres cosas buenas del día', icon: 'journal' },
  { name: 'Estudiar 1 hora', description: 'Programación o curso en línea', icon: 'write' },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function seed() {
  try {
    await mongoose.connect(cleanUri, options);

    const admin = await User.findOne({ email: 'admin@admin1' });
    const userId = admin ? admin._id : null;

    await Habit.deleteMany({});
    const picked = shuffle(HABITOS_ALEATORIOS).slice(0, 5);
    const toInsert = picked.map((h) => ({
      ...h,
      targetDays: 66,
      currentStreak: 0,
      completedDates: [],
      skippedDates: [],
      userId,
    }));
    const created = await Habit.insertMany(toInsert);
    console.log(`Eliminados hábitos anteriores. Creados ${created.length} hábitos (objetivo 66 días).`);
    if (!userId) console.log('Nota: hábitos sin usuario. Inicia sesión y crea hábitos desde la app para asignarlos.');
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
