# Guía completa para ejecutar BombCoupons

Este monorepo incluye:

- `Cliente/`: clon de BombCoupons en React + Vite.
- `Servidor/`: API en PHP 8 con AltoRouter y repositorios PDO.

Sigue las instrucciones paso a paso para dejar ambos servicios funcionando en local.

---

## 1. Requisitos previos

| Herramienta   | Versión recomendada |
| ------------- | ------------------- |
| Node.js       | 20.x o superior     |
| npm           | 10.x o superior     |
| PHP           | 8.1 o superior      |
| Composer      | 2.x                 |
| MySQL/MariaDB | Compatible con PDO  |

También necesitarás Apache/XAMPP (o similar) para servir `Servidor/` en `http://localhost:8080/cupones/servidor` con `mod_rewrite` habilitado.

---

## 2. Backend PHP (Servidor/)

1. **Instalar dependencias**

   ```bash
   cd Servidor
   composer install
   ```

2. **Configurar variables y base de datos**

   1. Copia `.env.example` a `.env` y revisa `APP_URL`, `FRONT_URL`, `DB_*` y `ALLOWED_ORIGINS`.
   2. Ajusta `config/database.php` si cambiaste credenciales.
   3. Crea la base ejecutando el dump:
      ```bash
      mysql -u root -p < database.sql
      ```

3. **Exponer la carpeta en Apache**

   - Apunta tu VirtualHost a `c:/xampp/htdocs/cupones/servidor/public` (o directamente al directorio `Servidor/`).
   - Asegúrate de que `AllowOverride All` esté habilitado para que `.htaccess` maneje las rutas.

4. **Permisos de almacenamiento**

   - Comprueba que `Servidor/uploads/logos` sea escribible. Allí se guardan los logos enviados desde el formulario.

5. **Probar endpoints**

   - `GET http://localhost:8080/cupones/servidor/cupones`
   - `GET http://localhost:8080/cupones/servidor/destacados`
   - `POST http://localhost:8080/cupones/servidor/cupones` (multipart con campos del cupón y archivo `logo` opcional)

Si ves JSON en los GET, el backend quedó operativo.

---

## 3. Frontend React (Cliente/)

1. **Instalar dependencias**

   ```bash
   cd Cliente
   npm install
   ```

2. **Configurar entorno**

   ```bash
   cp .env.example .env
   ```

   Revisa los valores clave:

   ```env
   VITE_API_HOST=http://localhost
   VITE_API_PORT=8080
   VITE_API_PATH=/cupones/servidor
   VITE_API_BASE_URL=http://localhost:8080/cupones/servidor
   VITE_USAR_MOCKS=false
   ```

   - Si cambias el host/puerto del backend, actualiza estos valores.
   - Para trabajar sin backend pon `VITE_USAR_MOCKS=true` (usará `public/api/*.json`).

3. **Levantar en desarrollo**

   ```bash
   npm run dev
   ```

   Abre `http://localhost:5173` (o la URL que muestre Vite) y verifica que los cupones carguen desde la API real.

4. **Build de producción**

   ```bash
   npm run build
   npm run preview
   ```

   El build final queda en `Cliente/dist`.

---

## 4. Flujo recomendado (paso a paso)

1. Clona el repositorio.
2. Completa la sección 2 para dejar el backend corriendo en `http://localhost:8080/cupones/servidor`.
3. Completa la sección 3 para instalar dependencias del cliente y configurar `.env`.
4. Ejecuta `npm run dev` dentro de `Cliente/` y abre la URL indicada por Vite.
5. Desde la UI crea un cupón nuevo. Si adjuntas un logo, el archivo se copiará automáticamente dentro de `Servidor/uploads/logos` y se servirá con una URL pública.

---

## 5. Solución de problemas

- **CORS bloqueado**: añade tu origen en `ALLOWED_ORIGINS` o `FRONT_URL` del backend y reinicia Apache.
- **MySQL rechaza la conexión**: confirma que las credenciales del `.env` coincidan con `config/database.php` y que el servicio esté en el puerto correcto.
- **Frontend sigue apuntando a mocks**: verifica `VITE_USAR_MOCKS=false` y reinicia Vite.
- **Logos no se muestran**: revisa permisos de escritura en `Servidor/uploads/logos` y que `APP_URL` coincida con la URL pública que utilizas.

---

## 6. Licencia

Este proyecto se distribuye bajo la [Licencia Apache 2.0](LICENSE). Revisa el archivo `LICENSE` para conocer tus derechos y obligaciones al reutilizar el código.
