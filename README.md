# Librería — Frontend

Aplicación web hecha con React 19 + Vite que consume la API de la librería (libros, usuarios y préstamos).

## Requisitos

- Node.js 20 o superior
- npm

## Variables de entorno

Antes de ejecutar el proyecto **debes crear un archivo `.env` en la raíz del proyecto** (junto a `package.json`). Este archivo no se versiona en el repositorio, por lo que cada quien debe crearlo localmente.

Variables requeridas:

| Variable                  | Descripción                                       | Ejemplo                                |
| ------------------------- | ------------------------------------------------- | -------------------------------------- |
| `VITE_API_URL_LIBROS`     | URL base del endpoint de libros del backend       | `http://localhost:8080/libros/`     |
| `VITE_API_URL_USUARIOS`   | URL base del endpoint de usuarios del backend     | `http://localhost:8080/usuarios/`   |
| `VITE_API_URL_PRESTAMOS`  | URL base del endpoint de préstamos del backend    | `http://localhost:8080/prestamos/`  |

Contenido de ejemplo para el `.env`:

```env
VITE_API_URL_LIBROS=http://localhost:8080/libros/
VITE_API_URL_USUARIOS=http://localhost:8080/usuarios/
VITE_API_URL_PRESTAMOS=http://localhost:8080/prestamos/
```

Notas:

- Las variables deben empezar con el prefijo `VITE_` para que Vite las exponga al cliente.
- Incluye la barra final (`/`) en las URLs, tal como en el ejemplo.
- Si cambias el `.env` con el servidor de desarrollo en ejecución, reinícialo para que tome los nuevos valores.

## Instalación y ejecución

```bash
npm install
npm run dev
```

## Scripts disponibles

| Script            | Descripción                                     |
| ----------------- | ----------------------------------------------- |
| `npm run dev`     | Levanta el servidor de desarrollo con HMR       |
| `npm run build`   | Genera el build de producción                   |
| `npm run preview` | Sirve localmente el build de producción         |
| `npm run lint`    | Ejecuta ESLint sobre el proyecto                |
