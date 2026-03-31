/**
 * Punto de entrada serverless para Vercel (@vercel/node).
 * Variables: MONGODB_URI, JWT_SECRET, ALLOWED_ORIGINS (URL del frontend, separadas por coma).
 */
require('dotenv').config();

const { createApp } = require('../src/app');

const app = createApp();
module.exports = app;
