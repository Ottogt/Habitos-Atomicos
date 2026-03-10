import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store';
import { fetchHabitsThunk } from './features/habitSlice';
import { Habits } from './components/Habits';
import './App.css';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { habits, status, error } = useSelector((state: RootState) => state.habit);

  useEffect(() => {
    dispatch(fetchHabitsThunk());
  }, [dispatch]);

  if (status === 'loading') {
    return (
      <p className="text-center py-12 text-gray-500 dark:text-gray-400">
        Cargando...
      </p>
    );
  }

  if (status === 'failed') {
    return (
      <p className="text-center py-12 text-red-600 dark:text-red-400">
        Error: {error ?? 'Error desconocido'}
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Hábitos
        </h1>
        <Habits habits={habits} />
      </div>
    </div>
  );
}

export default App;
