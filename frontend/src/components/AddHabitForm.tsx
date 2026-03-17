import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { createHabitThunk } from '../features/habitSlice';

interface AddHabitFormProps {
  onSuccess?: () => void;
}

export function AddHabitForm({ onSuccess }: AddHabitFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { status, error } = useSelector((state: RootState) => state.habit);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [targetDays, setTargetDays] = useState(66);
  const [icon, setIcon] = useState('default');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(
      createHabitThunk({
        name: name.trim(),
        description: description.trim() || undefined,
        targetDays,
        icon: icon || 'default',
      })
    );
    if (createHabitThunk.fulfilled.match(result)) {
      setName('');
      setDescription('');
      setTargetDays(66);
      setIcon('default');
      onSuccess?.();
    }
  };

  return (
    <div className="max-w-sm mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Agregar hábito
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}
        <div>
          <label htmlFor="habit-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nombre del hábito *
          </label>
          <input
            id="habit-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-green-300 rounded-lg bg-green-500/10 text-gray-900 placeholder:text-gray-600 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Ej: Leer 20 minutos"
          />
        </div>
        <div>
          <label htmlFor="habit-icon" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Icono
          </label>
          <select
            id="habit-icon"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            className="w-full px-3 py-2 border border-green-300 rounded-lg bg-green-500/10 text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
          <label htmlFor="habit-desc" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Descripción (opcional)
          </label>
          <input
            id="habit-desc"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-green-300 rounded-lg bg-green-500/10 text-gray-900 placeholder:text-gray-600 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Ej: Cada noche antes de dormir"
          />
        </div>
        <div>
          <label htmlFor="habit-days" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Meta (días, 21–365)
          </label>
          <input
            id="habit-days"
            type="number"
            min={21}
            max={365}
            value={targetDays}
            onChange={(e) => setTargetDays(Number(e.target.value))}
            className="w-full px-3 py-2 border border-green-300 rounded-lg bg-green-500/10 text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full py-2.5 px-4 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
        >
          {status === 'loading' ? 'Creando...' : 'Agregar hábito'}
        </button>
      </form>
    </div>
  );
}
