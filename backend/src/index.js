const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const habitsRouter = require('./routes/habits');
const authRouter = require('./routes/auth');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'] }));
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/habits', habitsRouter);
app.use('/habits', habitsRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API de Hábitos Atómicos' });
});

const startServer = async () => {
  try {
    await connectDB();
  } catch (err) {
    console.error('MongoDB no disponible:', err.message);
  }
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
};

startServer().catch((err) => {
  console.error('Error al iniciar el servidor:', err);
  process.exit(1);
});
