import { getApiBase } from '../lib/apiBase';

const AUTH_URL = `${getApiBase()}/api/auth`;

export interface User {
  _id: string;
  email: string;
  name?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

function mapNetworkError(err: unknown): Error {
  if (err instanceof TypeError && String(err.message).includes('fetch')) {
    return new Error(
      'No se pudo conectar con el servidor. Si estás en Vercel, revisa VITE_API_URL y que el backend esté desplegado.'
    );
  }
  return err instanceof Error ? err : new Error('Error de red');
}

export async function register(
  email: string,
  password: string,
  name?: string
): Promise<AuthResponse> {
  let response: Response;
  try {
    response = await fetch(`${AUTH_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name: name || '' }),
    });
  } catch (e) {
    throw mapNetworkError(e);
  }
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || `Error al registrar: ${response.status}`);
  }
  return response.json();
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  let response: Response;
  try {
    response = await fetch(`${AUTH_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  } catch (e) {
    throw mapNetworkError(e);
  }
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || `Error al iniciar sesión: ${response.status}`);
  }
  return response.json();
}
