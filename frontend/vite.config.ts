import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'require-vite-api-url-on-vercel',
      configResolved() {
        if (
          mode === 'production' &&
          process.env.VERCEL === '1' &&
          !String(process.env.VITE_API_URL || '').trim()
        ) {
          throw new Error(
            'En Vercel, define VITE_API_URL (Settings → Environment Variables): URL del proyecto backend, sin / al final. Luego redeploy del frontend.'
          )
        }
      },
    },
  ],
}))
