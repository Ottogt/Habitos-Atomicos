import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store';
import { fetchHabitsThunk } from './features/habitSlice';
import { Habits } from './components/Habits';
import { Sidebar, type View } from './components/Sidebar';
import { AuthLayout } from './components/AuthLayout';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { AddHabitForm } from './components/AddHabitForm';
import './App.css';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { habits, status, error } = useSelector((state: RootState) => state.habit);
  const { user } = useSelector((state: RootState) => state.auth);
  const [view, setView] = useState<View>('login');
  const [showAddHabitModal, setShowAddHabitModal] = useState(false);

  useEffect(() => {
    if (user) dispatch(fetchHabitsThunk());
  }, [dispatch, user]);

  const showHabits = view === 'habits' && user;

  // Sin sesión: solo pantalla de inicio de sesión o crear cuenta, sin sidebar
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <main className="flex-1 flex flex-col overflow-auto p-0">
          {view === 'register' ? (
            <AuthLayout
              leftTitle="Crear cuenta"
              rightHeadline="Empieza tu camino hacia mejores hábitos"
              rightDescription="Crea una cuenta para seguir y mejorar tus hábitos día a día."
            >
              <RegisterForm
                onSuccess={() => setView('habits')}
                onSwitchToLogin={() => setView('login')}
              />
            </AuthLayout>
          ) : (
            <AuthLayout
              leftTitle="Iniciar sesión"
              rightHeadline="Continúa tu camino hacia mejores hábitos"
              rightDescription="Inicia sesión para seguir y mejorar tus hábitos día a día."
            >
              <LoginForm
                onSuccess={() => setView('habits')}
                onSwitchToRegister={() => setView('register')}
              />
            </AuthLayout>
          )}
        </main>
      </div>
    );
  }

  // Con sesión: sidebar + contenido
  if (status === 'loading' && habits.length === 0) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar currentView={view} onNavigate={setView} />
        <main className="flex-1 flex items-center justify-center p-8">
          <p className="text-gray-500">Cargando...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        currentView={view}
        onNavigate={setView}
        onAddHabitClick={() => setShowAddHabitModal(true)}
      />
      <main className={`flex-1 flex flex-col overflow-auto ${view === 'register' ? 'p-0' : 'p-6'}`}>
        {showHabits && (
          <div className="max-w-7xl mx-auto flex-1 min-h-[75vh] bg-green-100 rounded-xl p-8">
            {status === 'failed' && error && (
              <p className="mb-4 text-red-600 text-sm">{error}</p>
            )}
            <Habits
              habits={habits}
              onAddHabit={() => setShowAddHabitModal(true)}
            />
          </div>
        )}
        {showAddHabitModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setShowAddHabitModal(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div
              className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 bg-green-600 rounded-t-xl">
                <h2 id="modal-title" className="text-xl font-semibold text-white">
                  Nuevo hábito
                </h2>
                <button
                  type="button"
                  onClick={() => setShowAddHabitModal(false)}
                  className="p-2 rounded-lg text-white hover:bg-green-500"
                  aria-label="Cerrar"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <AddHabitForm
                  onSuccess={() => setShowAddHabitModal(false)}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
