# Aplicación de Hábitos Atómicos

Proyecto inspirado en el libro "Hábitos Atómicos" de James Clear. Aplicación web para gestionar hábitos: crear cuenta, iniciar sesión, agregar hábitos y marcarlos como completados cada día. Si el hábito no se marca en un día, el conteo se reinicia. Una barra de progreso cambia de rojo a verde al acercarse a los 66 días.

**Entrega Semana 1:** Backend con Express.js, MongoDB Atlas y endpoints CRUD de hábitos.

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
   MONGODB_URI=mongodb+srv://tuUsuario:tuPassword@clusterxxxx.mongodb.net/habitos?retryWrites=true&w=majority
   PORT=5000
   ```

---

## Ejecución del proyecto

Desde la carpeta `backend`:

```bash
# Modo producción
npm start

# Modo desarrollo (reinicio automático con nodemon)
npm run dev
```

El servidor quedará disponible en **http://localhost:5000** (o el puerto definido en `PORT`).

- Health check: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## Endpoints disponibles

Base URL: `http://localhost:5000/api`

| Método   | Ruta              | Descripción                    |
| -------- | ----------------- | ------------------------------ |
| `POST`   | `/api/habits`     | Crear un nuevo hábito (Alta)   |
| `GET`    | `/api/habits`     | Listar todos los hábitos       |
| `GET`    | `/api/habits/:id` | Obtener un hábito por ID       |
| `PUT`    | `/api/habits/:id` | Actualizar hábito (cambio total) |
| `PATCH`  | `/api/habits/:id` | Actualización parcial (ej. marcar completado) |
| `DELETE` | `/api/habits/:id` | Eliminar un hábito (Baja)      |

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

**Marcar completado (PATCH /api/habits/:id):**
```json
{
  "currentStreak": 6,
  "lastCompletedDate": "2025-02-23T00:00:00.000Z"
}
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
│   │   │   └── Habit.js        # Esquema de hábitos
│   │   ├── routes/
│   │   │   └── habits.js       # Rutas CRUD
│   │   ├── controllers/
│   │   │   └── habitController.js
│   │   └── index.js           # Entry point
│   ├── package.json
│   └── .env.example
├── README.md
└── .gitignore
```

---

## Rama de entrega

La entrega de la Semana 1 debe enviarse en la rama **`semana1`** del repositorio en GitHub.
