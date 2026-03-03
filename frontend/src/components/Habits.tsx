import type { Habit } from '../features/habitApi';

interface HabitsProps {
  habits: Habit[];
}

export function Habits({ habits }: HabitsProps) {
  if (habits.length === 0) {
    return <p>No hay hábitos disponibles</p>;
  }

  return (
    <ul>
      {habits.map((habit) => (
        <li key={habit._id}>
          <strong>title:</strong> {habit.name} — <strong>completedDays:</strong> {habit.currentStreak}
        </li>
      ))}
    </ul>
  );
}
