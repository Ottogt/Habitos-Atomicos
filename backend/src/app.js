const express = require('express');
const cors = require('cors');
const habitsRouter = require('./routes/habits');
const authRouter = require('./routes/auth');
const connectDB = require('./config/db');

function getExplicitAllowedOrigins() {
  const extra = process.env.ALLOWED_ORIGINS || process.env.FRONTEND_URL || '';
  const defaults = ['http://localhost:5173', 'http://localhost:5174'];
  const fromEnv = extra
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return [...new Set([...defaults, ...fromEnv])];
}

/** Previews y producción en *.vercel.app (HTTPS). */
function isVercelAppOrigin(origin) {
  if (!origin || typeof origin !== 'string') return false;
  try {
    const u = new URL(origin);
    if (u.protocol !== 'https:') return false;
    const host = u.hostname.toLowerCase();
    return host === 'vercel.app' || host.endsWith('.vercel.app');
  } catch {
    return false;
  }
}

/**
 * Crea la app Express (sin listen). En Vercel se conecta Mongo en la primera petición.
 */
function createApp() {
  const app = express();

  const explicitOrigins = getExplicitAllowedOrigins();
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin) return callback(null, true);
        if (explicitOrigins.includes(origin)) return callback(null, true);
        if (isVercelAppOrigin(origin)) return callback(null, true);
        return callback(null, false);
      },
      credentials: true,
    })
  );
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
