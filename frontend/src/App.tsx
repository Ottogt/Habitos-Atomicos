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
    return <p>Cargando...</p>;
  }

  if (status === 'failed') {
    return <p>Error: {error ?? 'Error desconocido'}</p>;
  }

  return (
    <div>
      <h1>Hábitos</h1>
      <Habits habits={habits} />
    </div>
  );
}

export default App;
