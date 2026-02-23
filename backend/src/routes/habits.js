const express = require('express');
const {
  createHabit,
  getAllHabits,
  getHabitById,
  updateHabit,
  patchHabit,
  deleteHabit,
} = require('../controllers/habitController');

const router = express.Router();

router.post('/', createHabit);
router.get('/', getAllHabits);
router.get('/:id', getHabitById);
router.put('/:id', updateHabit);
router.patch('/:id', patchHabit);
router.delete('/:id', deleteHabit);

module.exports = router;
