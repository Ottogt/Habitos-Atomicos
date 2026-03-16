import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';
import { markHabitDoneThunk } from '../features/habitSlice';
import type { Habit } from '../features/habitApi';

interface HabitsProps {
  habits: Habit[];
}

function getProgressColor(progress: number): string {
  if (progress < 33) return 'bg-red-500';
  if (progress < 66) return 'bg-yellow-500';
  return 'bg-green-500';
}

export function Habits({ habits }: HabitsProps) {
  const dispatch = useDispatch<AppDispatch>();

  if (habits.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">No hay hábitos disponibles</p>
    );
  }

  return (
    <ul className="space-y-4">
      {habits.map((habit) => {
        const progress = Math.min(
          100,
          (habit.currentStreak / habit.targetDays) * 100
        );
        const progressColor = getProgressColor(progress);

        return (
          <li
            key={habit._id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm"
          >
            <div className="flex justify-between items-start gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                  {habit.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  {habit.currentStreak} / {habit.targetDays} días
                </p>
                <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${progressColor}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => dispatch(markHabitDoneThunk(habit._id))}
                className="shrink-0 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
              >
                Hecho
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
