import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { logout } from '../features/authSlice';

export type View = 'habits' | 'login' | 'register' | 'add-habit';

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  onAddHabitClick?: () => void;
}

export function Sidebar({ currentView, onNavigate, onAddHabitClick }: SidebarProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const linkClass = (view: View) =>
    `flex items-center gap-3 w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      currentView === view
        ? 'bg-green-500/40 text-white'
        : 'text-white hover:bg-green-500/30'
    }`;

  return (
    <aside className="w-56 shrink-0 bg-green-700 border-r border-green-800 flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-green-600 rounded-b-2xl px-4 py-5 flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-white" aria-hidden>
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
        <h2 className="text-lg font-semibold text-white">
          Hábitos Atómicos
        </h2>
      </div>
      <nav className="p-3 flex-1">
        <button
          type="button"
          onClick={() => onNavigate('habits')}
          className={linkClass('habits')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-white" aria-hidden>
            <rect width="7" height="7" x="3" y="3" rx="1" />
            <rect width="7" height="7" x="14" y="3" rx="1" />
            <rect width="7" height="7" x="14" y="14" rx="1" />
            <rect width="7" height="7" x="3" y="14" rx="1" />
          </svg>
          Ver hábitos
        </button>
        {!user ? (
          <button
            type="button"
            onClick={() => onNavigate('register')}
            className={linkClass('register')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-white" aria-hidden>
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Crear cuenta
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => onAddHabitClick?.() ?? onNavigate('add-habit')}
              className="flex items-center gap-3 w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-white hover:bg-green-500/30"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-white" aria-hidden>
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
              Agregar hábito
            </button>
            <div className="mt-4 pt-4 border-t border-green-600">
              <p className="flex items-center gap-3 px-4 py-1 text-xs text-white/90 truncate" title={user.email}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-white" aria-hidden>
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                {user.email}
              </p>
              <button
                type="button"
                onClick={() => dispatch(logout())}
                className="mt-2 flex items-center gap-3 w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-white hover:bg-red-500/40"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-white" aria-hidden>
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" x2="9" y1="12" y2="12" />
                </svg>
                Cerrar sesión
              </button>
            </div>
          </>
        )}
      </nav>
    </aside>
  );
}
