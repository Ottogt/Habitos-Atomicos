const HABITS_URL = 'http://localhost:3001/habits';

export interface Habit {
  _id: string;
  name: string;
  description?: string;
  userId?: string | null;
  targetDays: number;
  currentStreak: number;
  lastCompletedDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export async function fetchHabits(): Promise<Habit[]> {
  const response = await fetch(HABITS_URL);
  if (!response.ok) {
    throw new Error(`Error al cargar hábitos: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function patchHabit(id: string, data: Partial<Habit>): Promise<Habit> {
  const response = await fetch(`${HABITS_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`Error al actualizar el hábito: ${response.status} ${response.statusText}`);
  }
  return response.json();
}
