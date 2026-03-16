const mongoose = require('mongoose');
const Habit = require('../models/Habit');

// Fallback en memoria cuando MongoDB no está conectado (para que la app funcione igual)
let memoryHabits = [];
let memoryId = 1;

const isConnected = () => mongoose.connection.readyState === 1;

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/** Normaliza una fecha al inicio del día en UTC (solo fecha, sin hora). */
const toDayUTC = (d) => {
  if (!d) return null;
  const x = new Date(d);
  return new Date(Date.UTC(x.getUTCFullYear(), x.getUTCMonth(), x.getUTCDate()));
};

/**
 * Marca un hábito como hecho hoy. Aplica regla de racha:
 * - Si ya se marcó hoy → devuelve el hábito sin cambios.
 * - Si se marcó ayer → currentStreak += 1, lastCompletedDate = hoy.
 * - Si se marcó antes de ayer o nunca → reinicio: currentStreak = 1, lastCompletedDate = hoy.
 */
const markHabitDone = async (req, res) => {
  try {
    const { id } = req.params;
    const now = new Date();
    const today = toDayUTC(now);
    const yesterday = new Date(today);
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);

    if (!isConnected()) {
      const habit = memoryHabits.find((h) => h._id === id);
      if (!habit) {
        return res.status(404).json({ error: 'Hábito no encontrado' });
      }
      const lastDay = toDayUTC(habit.lastCompletedDate);
      if (lastDay && lastDay.getTime() === today.getTime()) {
        return res.status(200).json(habit);
      }
      if (lastDay && lastDay.getTime() === yesterday.getTime()) {
        habit.currentStreak = (habit.currentStreak || 0) + 1;
        habit.lastCompletedDate = now;
        habit.updatedAt = now;
        return res.status(200).json(habit);
      }
      habit.currentStreak = 1;
      habit.lastCompletedDate = now;
      habit.updatedAt = now;
      return res.status(200).json(habit);
    }

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'ID de hábito no válido' });
    }
    const habit = await Habit.findById(id);
    if (!habit) {
      return res.status(404).json({ error: 'Hábito no encontrado' });
    }

    const lastDay = toDayUTC(habit.lastCompletedDate);
    if (lastDay && lastDay.getTime() === today.getTime()) {
      return res.status(200).json(habit);
    }
    if (lastDay && lastDay.getTime() === yesterday.getTime()) {
      habit.currentStreak = (habit.currentStreak || 0) + 1;
      habit.lastCompletedDate = now;
      await habit.save();
      return res.status(200).json(habit);
    }
    habit.currentStreak = 1;
    habit.lastCompletedDate = now;
    await habit.save();
    return res.status(200).json(habit);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Error al marcar el hábito' });
  }
};

const createHabit = async (req, res) => {
  try {
    const { name, description, targetDays } = req.body;
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'El nombre del hábito es obligatorio' });
    }
    const userId = req.user ? req.user.id : null;
    if (!isConnected()) {
      const habit = {
        _id: `mem-${memoryId++}`,
        name: name.trim(),
        description: description ? description.trim() : '',
        userId,
        targetDays: targetDays ?? 66,
        currentStreak: 0,
        lastCompletedDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      memoryHabits.unshift(habit);
      return res.status(201).json(habit);
    }
    const habit = new Habit({
      name: name.trim(),
      description: description ? description.trim() : '',
      userId,
      targetDays: targetDays ?? 66,
    });
    await habit.save();
    return res.status(201).json(habit);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Error al crear el hábito' });
  }
};

const getAllHabits = async (req, res) => {
  try {
    if (!isConnected()) {
      const list = req.user
        ? memoryHabits.filter((h) => h.userId === req.user.id)
        : [...memoryHabits];
      return res.status(200).json(list);
    }
    const filter = req.user ? { userId: req.user.id } : {};
    const habits = await Habit.find(filter).sort({ createdAt: -1 });
    return res.status(200).json(habits);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener los hábitos' });
  }
};

const getHabitById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'ID de hábito no válido' });
    }
    const habit = await Habit.findById(id);
    if (!habit) {
      return res.status(404).json({ error: 'Hábito no encontrado' });
    }
    return res.status(200).json(habit);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener el hábito' });
  }
};

const updateHabit = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isConnected()) {
      const habit = memoryHabits.find((h) => h._id === id);
      if (!habit) {
        return res.status(404).json({ error: 'Hábito no encontrado' });
      }
      const { name, description, targetDays, currentStreak, lastCompletedDate } = req.body;
      if (name !== undefined) {
        if (typeof name !== 'string' || !name.trim()) {
          return res.status(400).json({ error: 'El nombre no puede estar vacío' });
        }
        habit.name = name.trim();
      }
      if (description !== undefined) habit.description = description.trim();
      if (targetDays !== undefined) habit.targetDays = targetDays;
      if (currentStreak !== undefined) habit.currentStreak = currentStreak;
      if (lastCompletedDate !== undefined) habit.lastCompletedDate = lastCompletedDate;
      habit.updatedAt = new Date();
      return res.status(200).json(habit);
    }
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'ID de hábito no válido' });
    }
    const { name, description, targetDays, currentStreak, lastCompletedDate } = req.body;
    const habit = await Habit.findById(id);
    if (!habit) {
      return res.status(404).json({ error: 'Hábito no encontrado' });
    }
    if (name !== undefined) {
      if (typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({ error: 'El nombre no puede estar vacío' });
      }
      habit.name = name.trim();
    }
    if (description !== undefined) habit.description = description.trim();
    if (targetDays !== undefined) habit.targetDays = targetDays;
    if (currentStreak !== undefined) habit.currentStreak = currentStreak;
    if (lastCompletedDate !== undefined) habit.lastCompletedDate = lastCompletedDate;
    await habit.save();
    return res.status(200).json(habit);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Error al actualizar el hábito' });
  }
};

const patchHabit = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isConnected()) {
      const habit = memoryHabits.find((h) => h._id === id);
      if (!habit) {
        return res.status(404).json({ error: 'Hábito no encontrado' });
      }
      const updates = req.body;
      if (updates.name !== undefined) {
        if (typeof updates.name !== 'string' || !updates.name.trim()) {
          return res.status(400).json({ error: 'El nombre no puede estar vacío' });
        }
        habit.name = updates.name.trim();
      }
      if (updates.description !== undefined) habit.description = updates.description;
      if (updates.targetDays !== undefined) habit.targetDays = updates.targetDays;
      if (updates.currentStreak !== undefined) habit.currentStreak = updates.currentStreak;
      if (updates.lastCompletedDate !== undefined) habit.lastCompletedDate = updates.lastCompletedDate;
      habit.updatedAt = new Date();
      return res.status(200).json(habit);
    }
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'ID de hábito no válido' });
    }
    const habit = await Habit.findById(id);
    if (!habit) {
      return res.status(404).json({ error: 'Hábito no encontrado' });
    }
    const updates = req.body;
    if (updates.name !== undefined) {
      if (typeof updates.name !== 'string' || !updates.name.trim()) {
        return res.status(400).json({ error: 'El nombre no puede estar vacío' });
      }
      habit.name = updates.name.trim();
    }
    if (updates.description !== undefined) habit.description = updates.description;
    if (updates.targetDays !== undefined) habit.targetDays = updates.targetDays;
    if (updates.currentStreak !== undefined) habit.currentStreak = updates.currentStreak;
    if (updates.lastCompletedDate !== undefined) habit.lastCompletedDate = updates.lastCompletedDate;
    await habit.save();
    return res.status(200).json(habit);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Error al actualizar el hábito' });
  }
};

const deleteHabit = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'ID de hábito no válido' });
    }
    const habit = await Habit.findByIdAndDelete(id);
    if (!habit) {
      return res.status(404).json({ error: 'Hábito no encontrado' });
    }
    return res.status(200).json({ message: 'Hábito eliminado correctamente', habit });
  } catch (error) {
    return res.status(500).json({ error: 'Error al eliminar el hábito' });
  }
};

module.exports = {
  createHabit,
  getAllHabits,
  getHabitById,
  updateHabit,
  patchHabit,
  deleteHabit,
  markHabitDone,
};
