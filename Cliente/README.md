# BombCoupons (Cliente)

Clon en React del sitio BombCoupons con soporte para modo claro/oscuro, rutas en español, códigos desenfocados y consumo de una API en PHP con AltoRouter.

## Requisitos

- Node.js 20+
- npm 10+

## Scripts disponibles

- `npm run dev`: servidor de desarrollo Vite.
- `npm run build`: build de producción.
- `npm run preview`: vista previa del build.

## Configuración de variables (.env)

Copiar `.env.example` a `.env` o `.env.local` y ajustar según el entorno:

```bash
cp .env.example .env
```

Variables relevantes:

<<<<<<< HEAD
- `VITE_API_PORT`: puerto del backend PHP (por defecto `80`).
- `VITE_API_BASE_URL`: URL completa del backend (`http://localhost:80/api`). Si no se define, se construye automáticamente con el puerto anterior.
- `VITE_USAR_MOCKS`: establecer en `true` para consumir los mocks de `public/api/*.json` en lugar del backend real.

## Cómo apuntar al backend en el puerto 80

1. Levanta el backend (carpeta `Servidor/`) en `http://localhost:80`.
2. Asegúrate de que el cliente tiene `VITE_API_PORT=80` o define explícitamente `VITE_API_BASE_URL=http://localhost:80/api` en tu `.env`.
=======
- `VITE_API_PORT`: puerto del backend PHP (por defecto `8080`).
- `VITE_API_BASE_URL`: URL completa del backend (`http://localhost:8080/api`). Si no se define, se construye automáticamente con el puerto anterior.
- `VITE_USAR_MOCKS`: establecer en `true` para consumir los mocks de `public/api/*.json` en lugar del backend real.

## Cómo apuntar al backend en el puerto 8080

1. Levanta el backend (carpeta `Servidor/`) en `http://localhost:8080`.
2. Asegúrate de que el cliente tiene `VITE_API_PORT=8080` o define explícitamente `VITE_API_BASE_URL=http://localhost:8080/api` en tu `.env`.
>>>>>>> 9391962d10d503ccedeca7891fbdb4d2fccd637e
3. Ejecuta `npm run dev` o `npm run build`. Las solicitudes de Axios usarán la URL configurada automáticamente.

Si necesitas cambiar el puerto, modifica `VITE_API_PORT` (y opcionalmente `VITE_API_BASE_URL`) y reinicia Vite para que los cambios surtan efecto.
