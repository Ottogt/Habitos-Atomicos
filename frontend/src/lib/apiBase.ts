/** Base URL del API (sin barra final). En Vercel debe definirse VITE_API_URL en el build. */
export function getApiBase(): string {
  const fromEnv = import.meta.env.VITE_API_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, '');
  if (import.meta.env.DEV) return 'http://localhost:3001'.replace(/\/$/, '');
  // En producción, localhost está bloqueado desde https (Private Network Access / loopback).
  throw new Error(
    'Falta VITE_API_URL. En Vercel (proyecto del frontend): Settings → Environment Variables → VITE_API_URL = URL https del backend sin / al final. Luego Redeploy.'
  );
}
