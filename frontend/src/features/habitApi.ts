const HABITS_URL = 'http://localhost:3001/habits';

export interface Habit {
  _id: string;
  name: string;
  description?: string;
  icon?: string;
  userId?: string | null;
  targetDays: number;
  currentStreak: number;
  lastCompletedDate?: string | null;
  completedDates?: string[];
  skippedDates?: string[];
  createdAt?: string;
  updatedAt?: string;
}

function headers(token?: string | null): HeadersInit {
  const h: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) (h as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  return h;
}

export async function fetchHabits(token?: string | null): Promise<Habit[]> {
  const response = await fetch(HABITS_URL, { headers: headers(token) });
  if (!response.ok) {
    throw new Error(`Error al cargar hábitos: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function createHabit(
  data: { name: string; description?: string; targetDays?: number; icon?: string },
  token?: string | null
): Promise<Habit> {
  const response = await fetch(HABITS_URL, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`Error al crear hábito: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function patchHabit(
  id: string,
  data: Partial<Pick<Habit, 'name' | 'description' | 'targetDays' | 'icon'>>,
  token?: string | null
): Promise<Habit> {
  const response = await fetch(`${HABITS_URL}/${id}`, {
    method: 'PATCH',
    headers: headers(token),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`Error al actualizar el hábito: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function deleteHabit(id: string, token?: string | null): Promise<{ habit: Habit }> {
  const response = await fetch(`${HABITS_URL}/${id}`, {
    method: 'DELETE',
    headers: headers(token),
  });
  if (!response.ok) {
    throw new Error(`Error al eliminar el hábito: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

/** Marca el hábito como hecho. Opcional date "YYYY-MM-DD" para marcar ese día; si no se pasa, se marca hoy. */
export async function markHabitDone(
  id: string,
  date?: string,
  token?: string | null
): Promise<Habit> {
  const response = await fetch(`${HABITS_URL}/${id}/done`, {
    method: 'PATCH',
    headers: headers(token),
    body: date ? JSON.stringify({ date }) : '{}',
  });
  if (!response.ok) {
    throw new Error(`Error al marcar hábito: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

/** Desmarca un día (quita esa fecha de completados). La barra de checks se vacía para ese día. */
export async function unmarkHabit(
  id: string,
  date?: string,
  token?: string | null
): Promise<Habit> {
  const response = await fetch(`${HABITS_URL}/${id}/unmark`, {
    method: 'PATCH',
    headers: headers(token),
    body: date ? JSON.stringify({ date }) : '{}',
  });
  if (!response.ok) {
    throw new Error(`Error al desmarcar: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

/** Reinicia el hábito (borra días realizados y racha). */
export async function skipHabit(id: string, token?: string | null): Promise<Habit> {
  const response = await fetch(`${HABITS_URL}/${id}/skip`, {
    method: 'PATCH',
    headers: headers(token),
  });
  if (!response.ok) {
    throw new Error(`Error al reiniciar hábito: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

/** Añade un día al contador del hábito. */
export async function addHabitDay(id: string, token?: string | null): Promise<Habit> {
  const response = await fetch(`${HABITS_URL}/${id}/add-day`, {
    method: 'PATCH',
    headers: headers(token),
  });
  if (!response.ok) {
    throw new Error(`Error al agregar día: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

/** Quita el último día del contador del hábito. */
export async function removeHabitDay(id: string, token?: string | null): Promise<Habit> {
  const response = await fetch(`${HABITS_URL}/${id}/remove-day`, {
    method: 'PATCH',
    headers: headers(token),
  });
  if (!response.ok) {
    throw new Error(`Error al quitar día: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

/** Marca el hábito como realizado al 100% (66 días). */
export async function completeHabit(id: string, token?: string | null): Promise<Habit> {
  const response = await fetch(`${HABITS_URL}/${id}/complete`, {
    method: 'PATCH',
    headers: headers(token),
  });
  if (!response.ok) {
    throw new Error(`Error al completar hábito: ${response.status} ${response.statusText}`);
  }
  return response.json();
}
