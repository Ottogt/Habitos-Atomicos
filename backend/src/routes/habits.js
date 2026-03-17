const express = require('express');
const {
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
} = require('../controllers/habitController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(requireAuth);

router.post('/', createHabit);
router.get('/', getAllHabits);
router.get('/:id', getHabitById);
router.patch('/:id/done', markHabitDone);
router.patch('/:id/unmark', unmarkHabit);
router.patch('/:id/skip', skipHabit);
router.patch('/:id/add-day', addHabitDay);
router.patch('/:id/remove-day', removeHabitDay);
router.patch('/:id/complete', completeHabit);
router.put('/:id', updateHabit);
router.patch('/:id', patchHabit);
router.delete('/:id', deleteHabit);

module.exports = router;
