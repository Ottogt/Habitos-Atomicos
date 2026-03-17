import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';
import { addHabitDayThunk, skipHabitThunk, completeHabitThunk } from '../features/habitSlice';
import type { Habit } from '../features/habitApi';

const ICON_MAP: Record<string, string> = {
  meditate: '🧘',
  book: '📖',
  exercise: '💪',
  write: '✏️',
  journal: '📓',
  default: '⭐',
};

function getIcon(icon?: string): string {
  return icon && ICON_MAP[icon] ? ICON_MAP[icon] : ICON_MAP.default;
}

/** Color tipo semáforo: bajo % rojo, medio amarillo, alto verde. */
function progressBarColor(porcentaje: number): string {
  if (porcentaje < 34) return 'bg-red-500';
  if (porcentaje < 67) return 'bg-amber-500';
  return 'bg-green-500';
}

interface HabitsProps {
  habits: Habit[];
  onAddHabit?: () => void;
}

export function Habits({ habits, onAddHabit }: HabitsProps) {
  const dispatch = useDispatch<AppDispatch>();

  if (habits.length === 0) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Mis hábitos</h1>
          {onAddHabit && (
            <button
              type="button"
              onClick={onAddHabit}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg"
            >
              + Nuevo hábito
            </button>
          )}
        </div>
        <p className="text-gray-500 text-center py-12">No hay hábitos. Crea uno para empezar.</p>
        <p className="text-center text-gray-400 text-sm mt-8">Cada día puede ser un 1% mejor.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Mis hábitos</h1>
        <div className="flex items-center gap-4">
          {onAddHabit && (
            <button
              type="button"
              onClick={onAddHabit}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg"
            >
              + Nuevo hábito
            </button>
          )}
        </div>
      </div>

      <ul className="grid grid-cols-2 gap-4">
        {habits.map((habit) => {
          const completed = habit.completedDates ?? [];
          const targetDays = habit.targetDays ?? 66;
          const diasRealizados = completed.length;
          const porcentaje = targetDays > 0 ? Math.min(100, Math.round((diasRealizados / targetDays) * 100)) : 0;

          return (
            <li
              key={habit._id}
              className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl shadow-sm"
            >
              <span className="text-2xl shrink-0" title={habit.icon || 'default'}>
                {getIcon(habit.icon)}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-gray-900 truncate">{habit.name}</h3>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-sm text-gray-600">Días realizados:</span>
                  <span className="font-medium text-gray-900">{diasRealizados}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => dispatch(addHabitDayThunk(habit._id))}
                      disabled={diasRealizados >= targetDays}
                      className="w-7 h-7 flex items-center justify-center rounded-full bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-lg font-bold leading-none"
                      title={diasRealizados >= targetDays ? 'Objetivo alcanzado (66 días)' : 'Agregar un día'}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => dispatch(skipHabitThunk(habit._id))}
                      className="w-7 h-7 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 text-white"
                      title="Omitir"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M21 2v6h-6" />
                        <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
                        <path d="M3 22v-6h6" />
                        <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => dispatch(completeHabitThunk(habit._id))}
                      disabled={diasRealizados >= targetDays}
                      className="w-7 h-7 flex items-center justify-center rounded-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white"
                      title={diasRealizados >= targetDays ? 'Ya completado al 100%' : 'Marcar como realizado al 100%'}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="mt-2 h-2 w-full max-w-xs bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${progressBarColor(porcentaje)}`}
                    style={{ width: `${porcentaje}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {porcentaje}% (objetivo {targetDays} días)
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="text-center text-gray-400 text-sm mt-8">Cada día puede ser un 1% mejor.</p>
    </div>
  );
}
