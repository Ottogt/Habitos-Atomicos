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
 * Marca un hábito como hecho en una fecha. Body opcional: { date: "YYYY-MM-DD" } (por defecto hoy).
 * Añade la fecha a completedDates y recalcula la racha.
 */
const markHabitDone = async (req, res) => {
  try {
    const { id } = req.params;
    const { date: dateStr } = req.body || {};
    const now = new Date();
    const targetDay = dateStr
      ? (() => {
          const [y, m, d] = (dateStr || '').split('-').map(Number);
          if (!y || !m || !d) return toDayUTC(now);
          const d2 = new Date(Date.UTC(y, m - 1, d));
          return toDayUTC(d2);
        })()
      : toDayUTC(now);

    if (!isConnected()) {
      const habit = memoryHabits.find((h) => h._id === id);
      if (!habit) {
        return res.status(404).json({ error: 'Hábito no encontrado' });
      }
      if (!habit.completedDates) habit.completedDates = [];
      addCompletedDate(habit, targetDay);
      recalcStreakFromCompletedDates(habit);
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
    addCompletedDate(habit, targetDay);
    recalcStreakFromCompletedDates(habit);
    await habit.save();
    return res.status(200).json(habit);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Error al marcar el hábito' });
  }
};

function addCompletedDate(habit, dayUTC) {
  if (!habit.completedDates) habit.completedDates = [];
  const exists = habit.completedDates.some(
    (d) => d && toDayUTC(d).getTime() === dayUTC.getTime()
  );
  if (!exists) habit.completedDates.push(dayUTC);
}

function addSkippedDate(habit, dayUTC) {
  if (!habit.skippedDates) habit.skippedDates = [];
  const exists = habit.skippedDates.some(
    (d) => d && toDayUTC(d).getTime() === dayUTC.getTime()
  );
  if (!exists) habit.skippedDates.push(dayUTC);
}

/** Recalcula currentStreak y lastCompletedDate a partir de completedDates. */
function recalcStreakFromCompletedDates(habit) {
  const dates = (habit.completedDates || [])
    .filter(Boolean)
    .map((d) => toDayUTC(d))
    .sort((a, b) => b.getTime() - a.getTime());
  if (dates.length === 0) {
    habit.currentStreak = 0;
    habit.lastCompletedDate = null;
    return;
  }
  habit.lastCompletedDate = dates[0];
  let streak = 1;
  const oneDay = 24 * 60 * 60 * 1000;
  for (let i = 1; i < dates.length; i++) {
    const diff = (dates[i - 1].getTime() - dates[i].getTime()) / oneDay;
    if (diff === 1) streak++;
    else break;
  }
  habit.currentStreak = streak;
}

/** Quita un día de completedDates y recalcula la racha. Body: { date: "YYYY-MM-DD" } (opcional, default hoy). */
const unmarkHabit = async (req, res) => {
  try {
    const { id } = req.params;
    const { date: dateStr } = req.body || {};
    const now = new Date();
    const targetDay = dateStr
      ? (() => {
          const [y, m, d] = dateStr.split('-').map(Number);
          if (!y || !m || !d) return toDayUTC(now);
          const d2 = new Date(y, m - 1, d);
          return toDayUTC(d2);
        })()
      : toDayUTC(now);

    if (!isConnected()) {
      const habit = memoryHabits.find((h) => h._id === id);
      if (!habit) return res.status(404).json({ error: 'Hábito no encontrado' });
      if (!habit.completedDates) habit.completedDates = [];
      habit.completedDates = habit.completedDates.filter(
        (d) => d && toDayUTC(d).getTime() !== targetDay.getTime()
      );
      recalcStreakFromCompletedDates(habit);
      habit.updatedAt = new Date();
      return res.status(200).json(habit);
    }

    if (!isValidObjectId(id)) return res.status(400).json({ error: 'ID de hábito no válido' });
    const habit = await Habit.findById(id);
    if (!habit) return res.status(404).json({ error: 'Hábito no encontrado' });
    if (!habit.completedDates) habit.completedDates = [];
    habit.completedDates = habit.completedDates.filter(
      (d) => d && toDayUTC(d).getTime() !== targetDay.getTime()
    );
    recalcStreakFromCompletedDates(habit);
    await habit.save();
    return res.status(200).json(habit);
  } catch (error) {
    if (error.name === 'ValidationError') return res.status(400).json({ error: error.message });
    return res.status(500).json({ error: 'Error al desmarcar' });
  }
};

/** Marca el hábito como omitido hoy (no cuenta para la racha). */
/** Reinicia el hábito: borra días realizados y racha. */
const skipHabit = async (req, res) => {
  try {
    const { id } = req.params;
    const now = new Date();

    if (!isConnected()) {
      const habit = memoryHabits.find((h) => h._id === id);
      if (!habit) return res.status(404).json({ error: 'Hábito no encontrado' });
      habit.completedDates = [];
      habit.skippedDates = [];
      habit.currentStreak = 0;
      habit.lastCompletedDate = null;
      habit.updatedAt = now;
      return res.status(200).json(habit);
    }

    if (!isValidObjectId(id)) return res.status(400).json({ error: 'ID de hábito no válido' });
    const habit = await Habit.findById(id);
    if (!habit) return res.status(404).json({ error: 'Hábito no encontrado' });
    habit.completedDates = [];
    habit.skippedDates = [];
    habit.currentStreak = 0;
    habit.lastCompletedDate = null;
    await habit.save();
    return res.status(200).json(habit);
  } catch (error) {
    if (error.name === 'ValidationError') return res.status(400).json({ error: error.message });
    return res.status(500).json({ error: 'Error al reiniciar el hábito' });
  }
};

/** Añade un día al contador (siempre suma uno). No añade si ya llegó al objetivo (66 días). */
const addHabitDay = async (req, res) => {
  try {
    const { id } = req.params;
    const now = new Date();
    const targetDays = 66;

    if (!isConnected()) {
      const habit = memoryHabits.find((h) => h._id === id);
      if (!habit) return res.status(404).json({ error: 'Hábito no encontrado' });
      if (!habit.completedDates) habit.completedDates = [];
      if (habit.completedDates.length >= (habit.targetDays || targetDays)) {
        return res.status(200).json(habit);
      }
      const today = toDayUTC(now);
      if (habit.completedDates.length === 0) {
        habit.completedDates.push(today);
      } else {
        const last = toDayUTC(habit.completedDates[habit.completedDates.length - 1]);
        const next = new Date(last);
        next.setUTCDate(next.getUTCDate() + 1);
        habit.completedDates.push(next);
      }
      recalcStreakFromCompletedDates(habit);
      habit.updatedAt = now;
      return res.status(200).json(habit);
    }

    if (!isValidObjectId(id)) return res.status(400).json({ error: 'ID de hábito no válido' });
    const habit = await Habit.findById(id);
    if (!habit) return res.status(404).json({ error: 'Hábito no encontrado' });
    if (!habit.completedDates) habit.completedDates = [];
    const maxDays = habit.targetDays || 66;
    if (habit.completedDates.length >= maxDays) {
      return res.status(200).json(habit);
    }
    const today = toDayUTC(now);
    if (habit.completedDates.length === 0) {
      habit.completedDates.push(today);
    } else {
      const last = toDayUTC(habit.completedDates[habit.completedDates.length - 1]);
      const next = new Date(last);
      next.setUTCDate(next.getUTCDate() + 1);
      habit.completedDates.push(next);
    }
    recalcStreakFromCompletedDates(habit);
    await habit.save();
    return res.status(200).json(habit);
  } catch (error) {
    if (error.name === 'ValidationError') return res.status(400).json({ error: error.message });
    return res.status(500).json({ error: 'Error al agregar día' });
  }
};

/** Marca el hábito como realizado al 100% (completa hasta targetDays). */
const completeHabit = async (req, res) => {
  try {
    const { id } = req.params;
    const now = new Date();
    const targetDays = 66;

    if (!isConnected()) {
      const habit = memoryHabits.find((h) => h._id === id);
      if (!habit) return res.status(404).json({ error: 'Hábito no encontrado' });
      const days = habit.targetDays || targetDays;
      habit.completedDates = [];
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setUTCDate(d.getUTCDate() - i);
        habit.completedDates.push(toDayUTC(d));
      }
      recalcStreakFromCompletedDates(habit);
      habit.updatedAt = now;
      return res.status(200).json(habit);
    }

    if (!isValidObjectId(id)) return res.status(400).json({ error: 'ID de hábito no válido' });
    const habit = await Habit.findById(id);
    if (!habit) return res.status(404).json({ error: 'Hábito no encontrado' });
    const days = habit.targetDays || targetDays;
    habit.completedDates = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setUTCDate(d.getUTCDate() - i);
      habit.completedDates.push(toDayUTC(d));
    }
    recalcStreakFromCompletedDates(habit);
    await habit.save();
    return res.status(200).json(habit);
  } catch (error) {
    if (error.name === 'ValidationError') return res.status(400).json({ error: error.message });
    return res.status(500).json({ error: 'Error al completar el hábito' });
  }
};

/** Quita el último día del contador. */
const removeHabitDay = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isConnected()) {
      const habit = memoryHabits.find((h) => h._id === id);
      if (!habit) return res.status(404).json({ error: 'Hábito no encontrado' });
      if (habit.completedDates && habit.completedDates.length > 0) {
        habit.completedDates.pop();
        recalcStreakFromCompletedDates(habit);
      }
      habit.updatedAt = new Date();
      return res.status(200).json(habit);
    }

    if (!isValidObjectId(id)) return res.status(400).json({ error: 'ID de hábito no válido' });
    const habit = await Habit.findById(id);
    if (!habit) return res.status(404).json({ error: 'Hábito no encontrado' });
    if (habit.completedDates && habit.completedDates.length > 0) {
      habit.completedDates.pop();
      recalcStreakFromCompletedDates(habit);
      await habit.save();
    }
    return res.status(200).json(habit);
  } catch (error) {
    if (error.name === 'ValidationError') return res.status(400).json({ error: error.message });
    return res.status(500).json({ error: 'Error al quitar día' });
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
      const { icon } = req.body;
      const habit = {
        _id: `mem-${memoryId++}`,
        name: name.trim(),
        description: description ? description.trim() : '',
        icon: icon && typeof icon === 'string' ? icon.trim() : 'default',
        userId,
        targetDays: targetDays ?? 66,
        currentStreak: 0,
        lastCompletedDate: null,
        completedDates: [],
        skippedDates: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      memoryHabits.unshift(habit);
      return res.status(201).json(habit);
    }
    const { icon } = req.body;
    const habit = new Habit({
      name: name.trim(),
      description: description ? description.trim() : '',
      icon: icon && typeof icon === 'string' ? icon.trim() : 'default',
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
  unmarkHabit,
  skipHabit,
  addHabitDay,
  removeHabitDay,
  completeHabit,
};
