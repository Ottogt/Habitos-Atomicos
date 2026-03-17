import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { register as registerApi, login as loginApi, type User } from './authApi';

const STORAGE_KEY = 'habitos_auth';

function loadStored(): { user: User; token: string } | null {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (!s) return null;
    return JSON.parse(s) as { user: User; token: string };
  } catch {
    return null;
  }
}

function saveStored(user: User, token: string) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }));
}

function clearStored() {
  localStorage.removeItem(STORAGE_KEY);
}

export const registerThunk = createAsyncThunk(
  'auth/register',
  async (
    { email, password, name }: { email: string; password: string; name?: string },
    { rejectWithValue }
  ) => {
    try {
      const data = await registerApi(email, password, name);
      saveStored(data.user, data.token);
      return data;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Error al registrar');
    }
  }
);

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const data = await loginApi(email, password);
      saveStored(data.user, data.token);
      return data;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Error al iniciar sesión');
    }
  }
);

interface AuthState {
  user: User | null;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const stored = loadStored();
const initialState: AuthState = {
  user: stored?.user ?? null,
  token: stored?.token ?? null,
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      clearStored();
      state.user = null;
      state.token = null;
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(loginThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export const authReducer = authSlice.reducer;
