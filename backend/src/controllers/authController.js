const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'clave-secreta-desarrollo';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
    }
    if (typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }

    const existing = await User.findOne({ email: email.trim().toLowerCase() });
    if (existing) {
      return res.status(400).json({ error: 'Ya existe un usuario con ese email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      name: name ? name.trim() : '',
    });
    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
    return res.status(201).json({
      user: user.toJSON(),
      token,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Ya existe un usuario con ese email' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
    return res.status(200).json({
      user: user.toJSON(),
      token,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

module.exports = { register, login };
