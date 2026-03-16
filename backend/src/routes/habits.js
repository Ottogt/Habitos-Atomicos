const express = require('express');
const {
  createHabit,
  getAllHabits,
  getHabitById,
  updateHabit,
  patchHabit,
  deleteHabit,
  markHabitDone,
} = require('../controllers/habitController');
const { optionalAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(optionalAuth);

router.post('/', createHabit);
router.get('/', getAllHabits);
router.get('/:id', getHabitById);
router.patch('/:id/done', markHabitDone);
router.put('/:id', updateHabit);
router.patch('/:id', patchHabit);
router.delete('/:id', deleteHabit);

module.exports = router;
