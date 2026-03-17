const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre del hábito es obligatorio'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    icon: {
      type: String,
      default: 'default',
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    targetDays: {
      type: Number,
      default: 66,
      min: 21,
      max: 365,
    },
    currentStreak: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastCompletedDate: {
      type: Date,
      default: null,
    },
    completedDates: {
      type: [Date],
      default: [],
    },
    skippedDates: {
      type: [Date],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('Habit', habitSchema);
