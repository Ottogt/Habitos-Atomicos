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
