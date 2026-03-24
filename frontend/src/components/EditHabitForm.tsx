import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { updateHabitThunk } from '../features/habitSlice';
import type { Habit } from '../features/habitApi';

interface EditHabitFormProps {
  habit: Habit;
  onSuccess?: () => void;
}

export function EditHabitForm({ habit, onSuccess }: EditHabitFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { status, error } = useSelector((state: RootState) => state.habit);
  const [name, setName] = useState(habit.name);
  const [description, setDescription] = useState(habit.description ?? '');
  const [targetDays, setTargetDays] = useState(habit.targetDays ?? 66);
  const [icon, setIcon] = useState(habit.icon ?? 'default');

  useEffect(() => {
    setName(habit.name);
    setDescription(habit.description ?? '');
    setTargetDays(habit.targetDays ?? 66);
    setIcon(habit.icon ?? 'default');
  }, [habit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(
      updateHabitThunk({
        id: habit._id,
        data: {
          name: name.trim(),
          description: description.trim() || undefined,
          targetDays,
          icon: icon || 'default',
        },
      })
    );
    if (updateHabitThunk.fulfilled.match(result)) {
      onSuccess?.();
    }
  };

  return (
    <div className="max-w-sm mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
        )}
        <div>
          <label htmlFor="edit-habit-name" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del hábito *
          </label>
          <input
            id="edit-habit-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-green-300 rounded-lg bg-green-500/10 text-gray-900 focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label htmlFor="edit-habit-icon" className="block text-sm font-medium text-gray-700 mb-1">
            Icono
          </label>
          <select
            id="edit-habit-icon"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            className="w-full px-3 py-2 border border-green-300 rounded-lg bg-green-500/10 text-gray-900 focus:ring-2 focus:ring-green-500"
          >
            <option value="default">⭐ General</option>
            <option value="meditate">🧘 Meditar</option>
            <option value="book">📖 Leer</option>
            <option value="exercise">💪 Ejercicio</option>
            <option value="write">✏️ Escribir</option>
            <option value="journal">📓 Diario</option>
          </select>
        </div>
        <div>
          <label htmlFor="edit-habit-desc" className="block text-sm font-medium text-gray-700 mb-1">
            Descripción (opcional)
          </label>
          <input
            id="edit-habit-desc"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-green-300 rounded-lg bg-green-500/10 text-gray-900 focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label htmlFor="edit-habit-days" className="block text-sm font-medium text-gray-700 mb-1">
            Meta (días, 21–365)
          </label>
          <input
            id="edit-habit-days"
            type="number"
            min={21}
            max={365}
            value={targetDays}
            onChange={(e) => setTargetDays(Number(e.target.value))}
            className="w-full px-3 py-2 border border-green-300 rounded-lg bg-green-500/10 text-gray-900 focus:ring-2 focus:ring-green-500"
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full py-2.5 px-4 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-medium rounded-lg"
        >
          {status === 'loading' ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  );
}
