const express = require('express');
const cors = require('cors');
const habitsRouter = require('./routes/habits');
const authRouter = require('./routes/auth');
const connectDB = require('./config/db');

function getAllowedOrigins() {
  const extra = process.env.ALLOWED_ORIGINS || process.env.FRONTEND_URL || '';
  const defaults = ['http://localhost:5173', 'http://localhost:5174'];
  const fromEnv = extra
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return [...new Set([...defaults, ...fromEnv])];
}

/**
 * Crea la app Express (sin listen). En Vercel se conecta Mongo en la primera petición.
 */
function createApp() {
  const app = express();

  app.use(cors({ origin: getAllowedOrigins(), credentials: true }));
  app.use(express.json());

  if (process.env.VERCEL) {
    let dbReady = false;
    app.use(async (req, res, next) => {
      if (dbReady) return next();
      try {
        await connectDB();
      } catch (e) {
        console.error('MongoDB (serverless):', e.message);
      }
      dbReady = true;
      next();
    });
  }

  app.use('/api/auth', authRouter);
  app.use('/api/habits', habitsRouter);
  app.use('/habits', habitsRouter);

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'API de Hábitos Atómicos' });
  });

  return app;
}

module.exports = { createApp };
