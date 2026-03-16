# Aplicación de Hábitos Atómicos

Proyecto inspirado en el libro "Hábitos Atómicos" de James Clear. Aplicación web para gestionar hábitos: crear cuenta, iniciar sesión, agregar hábitos y marcarlos como completados cada día. Si el hábito no se marca en un día, el conteo se reinicia. Una barra de progreso cambia de rojo a verde al acercarse a los 66 días.

**Entrega Semana 1:** Backend con Express.js, MongoDB Atlas y endpoints CRUD de hábitos.  
**Semana 2:** Frontend con React, Vite, TypeScript y Redux Toolkit.  
**Semana 4:** Lógica de racha/reinicio en backend (`PATCH /habits/:id/done`), registro y login con contraseña hasheada (bcrypt), JWT; botón "Hecho" y barra de progreso dinámica.

---

## Requisitos previos

- **Node.js** v18 o superior ([nodejs.org](https://nodejs.org))
- **Cuenta en MongoDB Atlas** ([mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas))
- Git (para clonar y usar la rama `semana1`)

---

## Instalación

1. Clonar el repositorio y entrar en el proyecto:
   ```bash
   git clone <url-del-repositorio>
   cd "Actividad No. 1"
   ```

2. Entrar en el backend e instalar dependencias:
   ```bash
   cd backend
   npm install
   ```

3. Configurar variables de entorno:
   ```bash
   cp .env.example .env
   ```
   Editar `.env` y asignar tu **MONGODB_URI** (ver sección siguiente).

---

## Configuración de MongoDB Atlas

1. Crear una cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) si no tienes una.
2. Crear un **cluster** (tier gratuito M0).
3. En **Database Access** → **Add New Database User**: crear usuario y contraseña (guardarlos).
4. En **Network Access** → **Add IP Address**: para desarrollo puedes usar `0.0.0.0/0` (permite cualquier IP) o añadir tu IP actual.
5. En el cluster, pulsar **Connect** → **Connect your application** y copiar el connection string.
6. El connection string tiene la forma:
   ```
   mongodb+srv://<user>:<password>@clusterxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority
   ```
   Reemplaza `<user>`, `<password>` y opcionalmente `<dbname>` (por ejemplo `habitos`).
7. En la raíz de `backend`, crea el archivo `.env` con:
   ```
   MONGODB_URI=mongodb+srv://tuUsuario:tuPassword@clusterxxxx.mongodb.net/habitos?retryWrites=true&w=majority&appName=Cluster0
   PORT=3001
   ```
   Si la contraseña tiene caracteres especiales (`@`, `#`, `/`, etc.), puedes usar usuario y contraseña por separado para no codificarlos en la URI:
   ```
   MONGODB_USER=tu_usuario
   MONGODB_PASS=tu_contraseña
   MONGODB_URI=mongodb+srv://clusterxxxx.mongodb.net/habitos?retryWrites=true&w=majority&appName=Cluster0
   PORT=3001
   ```
   **Semana 4 (auth):** añade en `.env` una clave para JWT: `JWT_SECRET=tu-clave-secreta` (y opcionalmente `JWT_EXPIRE=7d`). Ver `backend/.env.example`.
8. Si la conexión falla: revisa en Atlas **Network Access** (añade tu IP o `0.0.0.0/0` para desarrollo) y que el usuario y contraseña en Database Access sean correctos.

### Si no se conecta a la base de datos

El mensaje *"IP that isn't whitelisted"* o *"Could not connect to any servers"* significa que **MongoDB Atlas está bloqueando tu IP**. Hay que permitirla:

1. Entra en [MongoDB Atlas](https://cloud.mongodb.com) e inicia sesión.
2. En el menú izquierdo: **Network Access** (bajo "Security").
3. Pulsa **"+ ADD IP ADDRESS"**.
4. Opciones:
   - **Para desarrollo rápido:** elige **"ALLOW ACCESS FROM ANYWHERE"**. Esto añade `0.0.0.0/0` (cualquier IP). Solo recomendable para desarrollo.
   - **Más seguro:** pulsa **"ADD CURRENT IP ADDRESS"** para añadir solo tu IP actual. Si tu IP cambia (otra red, otro día), tendrás que añadirla de nuevo.
5. Guarda con **"Confirm"**. Los cambios pueden tardar 1–2 minutos.
6. Reinicia el backend (`npm run dev` en la carpeta `backend`).

Para ver tu IP pública desde la terminal (y añadirla manualmente si no usas "ADD CURRENT IP ADDRESS"):

```bash
curl -s ifconfig.me
```

---

## Ejecución del proyecto

### Backend

Desde la carpeta `backend`:

```bash
cd backend

# Modo producción
npm start

# Modo desarrollo (reinicio automático con nodemon)
npm run dev
```

El servidor quedará disponible en **http://localhost:5000** (o el puerto definido en `PORT` en tu `.env`). Para que el frontend se conecte correctamente, configura `PORT=3001` en `backend/.env`.

- Health check: `http://localhost:3001/api/health` (o el puerto que uses)
- API hábitos: `http://localhost:3001/habits`

### Frontend

El frontend (React + Vite + TypeScript + Redux) consume la API del backend. Para ejecutarlo:

1. **Instalar dependencias** (solo la primera vez):
   ```bash
   cd frontend
   npm install
   ```

2. **Arrancar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

3. **Abrir en el navegador** la URL que muestra Vite (por defecto **http://localhost:5173/**). Si ese puerto está ocupado, Vite usará otro (por ejemplo 5174).

4. **Requisito:** el backend debe estar corriendo en **http://localhost:3001** para que la app cargue y muestre los hábitos. Si el backend no está activo, verás error de conexión o "Cargando..." sin terminar.

**Resumen rápido (dos terminales):**

| Terminal 1 – Backend | Terminal 2 – Frontend |
|----------------------|------------------------|
| `cd backend && npm run dev` | `cd frontend && npm run dev` |
| Esperar: "Servidor corriendo en http://localhost:3001" | Abrir en el navegador la URL que indique Vite (ej. http://localhost:5173) |

---

## Endpoints disponibles

Base URL: `http://localhost:3001` (o el `PORT` de tu `.env`). Las rutas también están montadas en `/api/habits` y `/habits`.

### Hábitos

| Método   | Ruta                  | Descripción                    |
| -------- | --------------------- | ------------------------------ |
| `POST`   | `/habits`             | Crear un nuevo hábito          |
| `GET`    | `/habits`             | Listar hábitos (si hay token, solo los del usuario) |
| `GET`    | `/habits/:id`         | Obtener un hábito por ID       |
| `PATCH`  | `/habits/:id/done`    | **Marcar como hecho hoy** (lógica de racha en servidor: suma día o reinicia) |
| `PUT`    | `/habits/:id`         | Actualizar hábito (cambio total) |
| `PATCH`  | `/habits/:id`         | Actualización parcial          |
| `DELETE` | `/habits/:id`         | Eliminar un hábito             |

### Autenticación (Semana 4)

| Método   | Ruta                | Descripción                    |
| -------- | ------------------- | ------------------------------ |
| `POST`   | `/api/auth/register` | Registrar usuario (email, password con hash) |
| `POST`   | `/api/auth/login`   | Iniciar sesión (devuelve usuario + JWT)      |

**Registro:** body `{ "email": "...", "password": "...", "name": "..." }` (name opcional). La contraseña se guarda hasheada con bcrypt.  
**Login:** body `{ "email": "...", "password": "..." }`. Respuesta: `{ "user": { ... }, "token": "..." }`. Enviar el token en el header `Authorization: Bearer <token>` para que los hábitos creados y listados sean los del usuario.

### Ejemplos

**Crear hábito (POST /api/habits):**
```json
{
  "name": "Leer 20 minutos",
  "description": "Cada noche antes de dormir",
  "targetDays": 66
}
```

**Actualizar hábito (PUT /api/habits/:id):**
```json
{
  "name": "Leer 20 minutos",
  "description": "Cada noche",
  "targetDays": 66,
  "currentStreak": 5,
  "lastCompletedDate": "2025-02-23T00:00:00.000Z"
}
```

**Marcar como hecho hoy (PATCH /habits/:id/done)** — Semana 4: no envías body; el servidor aplica la regla de racha (si ya marcaste hoy no cambia; si marcaste ayer suma un día; si no marcaste ayer reinicia a 1 día).

**Registro (POST /api/auth/register):**
```json
{ "email": "usuario@ejemplo.com", "password": "minimo6", "name": "Tu nombre" }
```

**Login (POST /api/auth/login):**
```json
{ "email": "usuario@ejemplo.com", "password": "minimo6" }
```

---

## Estructura del proyecto

```
Actividad No. 1/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js           # Conexión MongoDB con Mongoose
│   │   ├── models/
│   │   │   ├── Habit.js        # Esquema de hábitos
│   │   │   └── User.js         # Usuario (Semana 4)
│   │   ├── middleware/
│   │   │   └── authMiddleware.js  # JWT opcional/requerido
│   │   ├── routes/
│   │   │   ├── habits.js       # Rutas CRUD + PATCH /:id/done
│   │   │   └── auth.js         # register, login
│   │   ├── controllers/
│   │   │   ├── habitController.js
│   │   │   └── authController.js
│   │   └── index.js            # Entry point
│   ├── package.json
│   └── .env.example
├── frontend/                   # React + Vite + TypeScript + Redux (Semana 2)
│   ├── src/
│   │   ├── features/           # habitApi, habitSlice
│   │   ├── components/         # Habits.tsx
│   │   ├── store.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
├── README.md
└── .gitignore
```

---

## Ramas de entrega

- **Semana 1:** rama **`semana1`** (backend + MongoDB + CRUD hábitos).
- **Semana 2:** rama **`semana-2`** (frontend + CORS + endpoint `/habits`).
- **Semana 4:** rama **`semana4`** (racha/reinicio en backend, registro y login con hash, botón Hecho y barra de progreso).
