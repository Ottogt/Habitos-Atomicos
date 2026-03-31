# Desplegar en Vercel (https://vercel.com)

No puedes subir el código desde aquí sin iniciar sesión en tu cuenta. Sigue estos pasos en tu máquina (con [Vercel CLI](https://vercel.com/docs/cli) o desde el dashboard).

## 1. Proyecto **backend** (API)

1. En [Vercel Dashboard](https://vercel.com) → **Add New** → **Project** → importa el repo **Habitos-Atomicos**.
2. **Root Directory:** `backend`
3. **Environment Variables** (Production + Preview si quieres):
   - `MONGODB_URI` — connection string de Atlas (igual que en local).
   - `MONGODB_USER` / `MONGODB_PASS` — si los usas en local, también aquí.
   - `JWT_SECRET` — secreto fuerte en producción.
   - `ALLOWED_ORIGINS` — URL(s) del frontend en Vercel, separadas por coma.  
     Ejemplo: `https://habitos-frontend.vercel.app`
4. Deploy. La API quedará en una URL tipo `https://tu-backend.vercel.app`.

**MongoDB Atlas:** en **Network Access** permite `0.0.0.0/0` (o las IPs que indique Vercel) para que las funciones serverless puedan conectar.

**Health check:** `GET https://tu-backend.vercel.app/api/health`

## 2. Proyecto **frontend** (React + Vite)

1. **Add New** → **Project** → mismo repo **Habitos-Atomicos** (puedes tener dos proyectos apuntando al mismo repo).
2. **Root Directory:** `frontend`
3. **Build Command:** `npm run build` (por defecto).
4. **Output Directory:** `dist`
5. **Environment Variables:**
   - `VITE_API_URL` — URL del backend **sin** barra final.  
     Ejemplo: `https://tu-backend.vercel.app`
6. Deploy.

## 3. CORS

Tras el primer deploy del frontend, copia su URL y añádela al backend en `ALLOWED_ORIGINS` (o vuelve a desplegar el backend si ya la pusiste).

## 4. Rama Git `semana-5`

Los cambios de despliegue y Vercel están en la rama **`semana-5`**. Para producción puedes asignar esa rama en **Settings → Git → Production Branch** de cada proyecto Vercel, o desplegar desde `main` tras hacer merge.
