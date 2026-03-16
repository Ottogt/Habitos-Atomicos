import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchHabits, markHabitDone, type Habit } from './habitApi';

export const fetchHabitsThunk = createAsyncThunk(
  'habit/fetchHabits',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchHabits();
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar hábitos';
      return rejectWithValue(message);
    }
  }
);

export const markHabitDoneThunk = createAsyncThunk(
  'habit/markHabitDone',
  async (id: string, { rejectWithValue }) => {
    try {
      const updated = await markHabitDone(id);
      return updated;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al marcar hábito';
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
      });
  },
});

export const habitReducer = habitSlice.reducer;
