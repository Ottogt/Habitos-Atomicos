import { configureStore } from '@reduxjs/toolkit';
import { habitReducer } from './features/habitSlice';
import { authReducer } from './features/authSlice';

export const store = configureStore({
  reducer: {
    habit: habitReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
