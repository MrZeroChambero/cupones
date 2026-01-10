# Lineamientos para el backend de BombCoupons (clon)

Estos son los requisitos mínimos para que el frontend funcione sin cambios adicionales.

## Endpoints esperados

- `GET /cupones`
  - Devuelve `{ "cupones": Cupon[] }`.
  - Cada `Cupon` debe contener: `id`, `marca`, `descripcion`, `codigo`, `categoria`, `expira`, `descuento`, `enlace`, `logo` (URL absoluta).
- `GET /destacados`
  - Devuelve `{ "destacados": Destacado[] }`.
  - Cada `Destacado` necesita `id`, `titulo`, `marca`, `copy`, `codigo`, `descuento`, `expira`, `cuponId` (referencia al cupón real para poder revelarlo desde el hero).

> Durante el desarrollo local el proyecto consume `/public/api/*.json`. Al desplegar, basta con definir la variable `VITE_API_BASE_URL` apuntando al backend real.

## Estado HTTP

- Respuesta exitosa: `200 OK` con los objetos anteriores.
- Errores: enviar `{ "mensaje": string }` y el código HTTP correspondiente (400, 404, 500).

## Seguridad y caché

- Habilitar CORS para el dominio donde viva el cliente React.
- Permitir cache-control de 5 minutos para `GET /cupones` y `GET /destacados`, ya que el front refresca manualmente.

## Ejemplo de cupón

```json
{
  "id": 1,
  "marca": "TechNova",
  "descripcion": "50% de descuento en accesorios inteligentes",
  "codigo": "TECHNOVA50",
  "categoria": "Tecnología",
  "expira": "2026-02-15",
  "descuento": "50%",
  "enlace": "https://tienda.technova.com/ofertas",
  "logo": "https://cdn.tu-dominio.com/logos/technova.png"
}
```

## Ejemplo de destacado

```json
{
  "id": 101,
  "titulo": "Cuponazo del Mes",
  "marca": "TechNova",
  "copy": "Aplica para laptops y monitores",
  "codigo": "MEGATECH",
  "descuento": "Hasta 60%",
  "expira": "2026-02-01",
  "cuponId": 1
}
```

Mantener estos contratos garantiza que el `switch` de `src/services/solicitudes.js` pueda normalizar las respuestas sin cambios adicionales.
