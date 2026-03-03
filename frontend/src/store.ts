import { configureStore } from '@reduxjs/toolkit';
import { habitReducer } from './features/habitSlice';

export const store = configureStore({
  reducer: {
    habit: habitReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
