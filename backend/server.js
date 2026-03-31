/**
 * Entrada para Vercel (Express serverless). Prioridad: server.js en la raíz del proyecto backend.
 */
require('dotenv').config();
const { createApp } = require('./src/app');

module.exports = createApp();
