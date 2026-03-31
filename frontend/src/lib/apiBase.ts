/** Base URL del API (sin barra final). En Vercel debe definirse VITE_API_URL en el build. */
export function getApiBase(): string {
  const fromEnv = import.meta.env.VITE_API_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, '');
  if (import.meta.env.DEV) return 'http://localhost:3001'.replace(/\/$/, '');
  return 'http://localhost:3001'.replace(/\/$/, '');
}
