import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchHabits, type Habit } from './habitApi';

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
      });
  },
});

export const habitReducer = habitSlice.reducer;
