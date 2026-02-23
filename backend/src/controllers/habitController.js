const mongoose = require('mongoose');
const Habit = require('../models/Habit');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const createHabit = async (req, res) => {
  try {
    const { name, description, targetDays } = req.body;
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'El nombre del hábito es obligatorio' });
    }
    const habit = new Habit({
      name: name.trim(),
      description: description ? description.trim() : '',
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
    const habits = await Habit.find().sort({ createdAt: -1 });
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
};
