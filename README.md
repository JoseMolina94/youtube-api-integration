# YouTube API Integration

Aplicación fullstack que integra la API de YouTube para buscar, explorar y guardar videos y canales favoritos, con autenticación de usuarios y persistencia en MongoDB.

## Tecnologías usadas

- **Frontend:** Next.js 13 (App Router), React, TailwindCSS, TypeScript
- **Backend:** Node.js, Express, TypeScript, MongoDB
- **API externa:** YouTube Data API v3

---

## Estructura del proyecto

```
youtube-api-integration/
  backend/         # API REST, autenticación, persistencia
  frontend/        # Aplicación web Next.js
```

---

## Instrucciones para arrancar el proyecto

### 1. Clonar el repositorio

```bash
git clone git@github.com:JoseMolina94/youtube-api-integration.git
cd youtube-api-integration
```

### 2. Configurar variables de entorno

Estas variables de entorno son para poder correr la prueba, y estan aqui solo con el fin demostrativo ya que por temas de seguridad no deberian estar los archivos en el repositorio, no obstante tambien puedes encontrarlos para facilitar la visibilidad de la misma.

#### Backend (`backend/.env`):

Crea un archivo `.env` dentro de la carpeta `backend/` con el siguiente contenido:

```
PORT=4000
MONGODB_URI=mongodb+srv://joserafaelmolinamontano:tk9I8UOreVWkneOo@cluster0.cuifffw.mongodb.net/video_store?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=tk9I8UOreVWkneOo
YT_API_KEY=TU_API_KEY_DE_YOUTUBE
```

- **YT_API_KEY:**
  - Ve a [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
  - Crea un proyecto y habilita la "YouTube Data API v3"
  - Crea una API Key y pégala en el campo `YT_API_KEY`

#### Frontend (`frontend/.env.local`):

Crea un archivo `.env.local` dentro de la carpeta `frontend/` con el siguiente contenido:

```
NEXT_PUBLIC_BACKEND_API=http://localhost:4000/api
NEXT_PUBLIC_RANDOM_AVATAR_API=https://api.dicebear.com/7.x/avataaars/svg?seed
```

---

## 3. Instalar dependencias

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd ../frontend
npm install
```

---

## 4. Arrancar el backend
```bash
cd backend
npm run dev
```
El backend estará corriendo en [http://localhost:4000](http://localhost:4000)

---

## 5. Arrancar el frontend
```bash
cd frontend
npm run dev
```
El frontend estará corriendo en [http://localhost:3000](http://localhost:3000)

---

## Funcionalidades principales
- Buscar videos y canales de YouTube
- Infinite scroll en resultados
- Guardar videos como favoritos y ver más tarde
- Autenticación de usuarios (registro, login, logout)
- Visualización de favoritos y ver más tarde
- Feedback visual con Toasts
- Soporte para tema claro/oscuro

---

## Notas
- Asegúrate de tener MongoDB corriendo localmente o usa una URI de Mongo Atlas.
- Si cambias la API Key de YouTube, reinicia el backend.
- Si tienes dudas sobre la estructura de los archivos `.env`, revisa los ejemplos arriba.

---

¡Listo! Ahora puedes explorar, buscar y guardar tus videos favoritos de YouTube desde tu propia app.
