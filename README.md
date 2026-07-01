# TETRUX Store

Una tienda de videojuegos construida con React. Nació como proyecto de curso y terminó teniendo panel de admin, autenticación real con Firebase y un diseño oscuro inspirado en Steam.

---

## Qué tiene

- Catálogo de juegos con búsqueda en tiempo real y filtros por género
- Carrito de compras persistente
- Login y registro de usuarios con Firebase Authentication
- Panel de administración para agregar, editar y borrar productos
- Rutas protegidas (la biblioteca y el admin solo se ven si estás logueado)
- Paginación, spinners de carga y manejo de errores
- Diseño responsivo que funciona en celular, tablet y escritorio

---

## Stack

React · Vite · Firebase Authentication · Firebase Realtime Database · React Router · React Bootstrap · styled-components · react-icons · react-helmet-async

---

## Cómo correrlo localmente

### 1. Clonar e instalar

```bash
git clone https://github.com/tu_usuario/tetrux-store.git
cd tetrux-store
npm install
```

### 2. Crear el archivo `.env`

En la raíz del proyecto creá un archivo llamado `.env` y pegá esto con tus datos de Firebase:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_DATABASE_URL=
```

Los valores los encontrás en Firebase Console → Project Settings → tu app web.

### 3. Configurar Firebase

Dos cosas que tenés que activar manualmente en la consola:

**Authentication:** Build → Authentication → Sign-in method → Email/Password → activar

**Realtime Database:** Build → Realtime Database → Create database → elegí una región → en Rules pegá esto:

```json
{
  "rules": {
    "products": {
      ".read": true,
      ".write": "auth != null"
    }
  }
}
```

Esto permite que cualquiera vea los productos, pero solo usuarios logueados puedan modificarlos.

### 4. Cargar los productos iniciales

Solo hace falta correrlo una vez. Esto puebla la base de datos con los juegos del catálogo:

```bash
node scripts/seed.js
```

### 5. Arrancar

```bash
npm run dev
```

Abre `http://localhost:5173` y listo.

---

## Deploy en Netlify

El proyecto ya tiene el `netlify.toml` configurado, así que solo necesitás:

1. Subir el proyecto a GitHub
2. En Netlify: Add new site → Import from Git → conectar el repo
3. Agregar las mismas variables del `.env` en Site settings → Environment variables
4. Deploy

Build command: `npm run build` — Publish directory: `dist`

---

## Estructura