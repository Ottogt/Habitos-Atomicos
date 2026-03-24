# Hábitos Atómicos — Actividad (Programación Avanzada)

Monorepo con **backend** (Node.js + Express + MongoDB) y **frontend** (React + Vite + Redux).

## Nota sobre el stack del frontend (rúbrica / Semana 4)

Algunos enunciados piden registro y login desde el frontend con **Next.js**. Este proyecto implementa el mismo flujo con una **SPA en React + Vite**: pantallas de inicio de sesión y registro, llamadas a la API de autenticación y persistencia del JWT. Funcionalmente equivale a una aplicación cliente con rutas de login/registro; solo cambia el framework (Vite en lugar de Next).

## Validación Semana 4: middleware, JWT, login y hábitos

| Requisito | Implementación |
|-----------|----------------|
| **Middleware de identificación y autorización (backend)** | [`backend/src/middleware/authMiddleware.js`](backend/src/middleware/authMiddleware.js): `requireAuth` valida `Authorization: Bearer <JWT>` y asigna `req.user = { id }`. Las rutas de hábitos usan `router.use(requireAuth)` en [`backend/src/routes/habits.js`](backend/src/routes/habits.js). |
| **Registro y login desde el frontend** | [`frontend/src/components/LoginForm.tsx`](frontend/src/components/LoginForm.tsx), [`RegisterForm.tsx`](frontend/src/components/RegisterForm.tsx), [`authApi.ts`](frontend/src/features/authApi.ts) → `POST /api/auth/login` y `POST /api/auth/register`. Backend: [`authController.js`](backend/src/controllers/authController.js). |
| **Envío de JWT del frontend al backend** | [`frontend/src/features/habitApi.ts`](frontend/src/features/habitApi.ts): cabecera `Authorization: Bearer ${token}`. Los thunks en [`habitSlice.ts`](frontend/src/features/habitSlice.ts) leen el token de Redux (`auth.token`), guardado tras login en [`authSlice.ts`](frontend/src/features/authSlice.ts) (y `localStorage`). |
| **Flujo para agregar hábitos** | Modal en [`frontend/src/App.tsx`](frontend/src/App.tsx) + [`AddHabitForm.tsx`](frontend/src/components/AddHabitForm.tsx) → `createHabitThunk` con JWT. El backend asocia `userId` al crear el hábito. |

## Cómo ejecutar

**Backend** (puerto típico `3001`):

```bash
cd backend
cp .env.example .env   # configurar MONGODB_URI y JWT_SECRET
npm install
npm run dev
```

**Frontend** (Vite, puerto típico `5173`):

```bash
cd frontend
npm install
npm run dev
```

Variables: el frontend asume API en `http://localhost:3001` (ver `habitApi.ts` y `authApi.ts`).

## Scripts útiles (backend)

- `npm run init-db` — inicializar base de datos
- `npm run seed-admin` — usuario admin de prueba
- `npm run seed-habits` — hábitos de ejemplo (según script configurado)

---

## Semana 5 — CRUD completo y autorización por recurso

| Requisito | Implementación |
|-----------|----------------|
| **REST CRUD (DELETE y PATCH en uso)** | `DELETE /habits/:id` y `PATCH /habits/:id` protegidos con JWT. Frontend: botón eliminar (con confirmación) y modal **Editar hábito** (`EditHabitForm` + `updateHabitThunk`). |
| **Autorización por propietario** | En [`backend/src/controllers/habitController.js`](backend/src/controllers/habitController.js), `assertHabitBelongsToUser`: solo el `userId` del hábito coincide con el usuario del token (403 si no). Aplica a GET por id, PATCH, PUT, DELETE y a todas las acciones (`/done`, `/skip`, `/add-day`, etc.). |
| **Modo memoria** | `DELETE` y `GET /:id` soportan hábitos en memoria cuando Mongo no está conectado. |
| **PATCH con `icon`** | Actualización parcial permite cambiar nombre, descripción, meta de días e icono. |

**Rama Git:** `semana5` (incluye lo de Semana 4 más estos cambios).
