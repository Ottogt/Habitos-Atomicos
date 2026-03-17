import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { fetchHabits, markHabitDone, unmarkHabit, skipHabit, addHabitDay, removeHabitDay, completeHabit, createHabit as createHabitApi, type Habit } from './habitApi';

export const fetchHabitsThunk = createAsyncThunk(
  'habit/fetchHabits',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as RootState).auth.token;
      const data = await fetchHabits(token);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar hábitos';
      return rejectWithValue(message);
    }
  }
);

export const createHabitThunk = createAsyncThunk(
  'habit/createHabit',
  async (
    data: { name: string; description?: string; targetDays?: number; icon?: string },
    { getState, rejectWithValue }
  ) => {
    try {
      const token = (getState() as RootState).auth.token;
      const habit = await createHabitApi(data, token);
      return habit;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear hábito';
      return rejectWithValue(message);
    }
  }
);

export const markHabitDoneThunk = createAsyncThunk(
  'habit/markHabitDone',
  async (
    payload: string | { id: string; date?: string },
    { getState, rejectWithValue }
  ) => {
    try {
      const token = (getState() as RootState).auth.token;
      const id = typeof payload === 'string' ? payload : payload.id;
      const date = typeof payload === 'string' ? undefined : payload.date;
      const updated = await markHabitDone(id, date, token);
      return updated;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al marcar hábito';
      return rejectWithValue(message);
    }
  }
);

export const unmarkHabitThunk = createAsyncThunk(
  'habit/unmarkHabit',
  async (
    { id, date }: { id: string; date?: string },
    { getState, rejectWithValue }
  ) => {
    try {
      const token = (getState() as RootState).auth.token;
      const updated = await unmarkHabit(id, date, token);
      return updated;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al desmarcar';
      return rejectWithValue(message);
    }
  }
);

export const skipHabitThunk = createAsyncThunk(
  'habit/skipHabit',
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as RootState).auth.token;
      const updated = await skipHabit(id, token);
      return updated;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al reiniciar hábito';
      return rejectWithValue(message);
    }
  }
);

export const addHabitDayThunk = createAsyncThunk(
  'habit/addHabitDay',
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as RootState).auth.token;
      const updated = await addHabitDay(id, token);
      return updated;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al agregar día';
      return rejectWithValue(message);
    }
  }
);

export const removeHabitDayThunk = createAsyncThunk(
  'habit/removeHabitDay',
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as RootState).auth.token;
      const updated = await removeHabitDay(id, token);
      return updated;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al quitar día';
      return rejectWithValue(message);
    }
  }
);

export const completeHabitThunk = createAsyncThunk(
  'habit/completeHabit',
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as RootState).auth.token;
      const updated = await completeHabit(id, token);
      return updated;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al completar hábito';
      return rejectWithValue(message);
    }
  }
);

export type HabitStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

interface HabitState {
  habits: Habit[];
  status: HabitStatus;
  error: string | null;
}

const initialState: HabitState = {
  habits: [],
  status: 'idle',
  error: null,
};

const habitSlice = createSlice({
  name: 'habit',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHabitsThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchHabitsThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.habits = action.payload;
        state.error = null;
      })
      .addCase(fetchHabitsThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(markHabitDoneThunk.fulfilled, (state, action) => {
        const index = state.habits.findIndex((h) => h._id === action.payload._id);
        if (index !== -1) {
          state.habits[index] = action.payload;
        }
      })
      .addCase(unmarkHabitThunk.fulfilled, (state, action) => {
        const index = state.habits.findIndex((h) => h._id === action.payload._id);
        if (index !== -1) {
          state.habits[index] = action.payload;
        }
      })
      .addCase(skipHabitThunk.fulfilled, (state, action) => {
        const index = state.habits.findIndex((h) => h._id === action.payload._id);
        if (index !== -1) {
          state.habits[index] = action.payload;
        }
      })
      .addCase(addHabitDayThunk.fulfilled, (state, action) => {
        const index = state.habits.findIndex((h) => h._id === action.payload._id);
        if (index !== -1) {
          state.habits[index] = action.payload;
        }
      })
      .addCase(removeHabitDayThunk.fulfilled, (state, action) => {
        const index = state.habits.findIndex((h) => h._id === action.payload._id);
        if (index !== -1) {
          state.habits[index] = action.payload;
        }
      })
      .addCase(completeHabitThunk.fulfilled, (state, action) => {
        const index = state.habits.findIndex((h) => h._id === action.payload._id);
        if (index !== -1) {
          state.habits[index] = action.payload;
        }
      })
      .addCase(createHabitThunk.fulfilled, (state, action) => {
        state.habits.unshift(action.payload);
        state.error = null;
      });
  },
});

export const habitReducer = habitSlice.reducer;
