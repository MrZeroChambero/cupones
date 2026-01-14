const limpiarHost = (host = "") => host.replace(/\/$/, "");
const asegurarPath = (ruta = "/") => (ruta.startsWith("/") ? ruta : `/${ruta}`);
const limpiarPath = (ruta = "/") => asegurarPath(ruta).replace(/\/{2,}/g, "/");

const obtenerEnv = (clave, predeterminado = "") => {
  const valor = import.meta.env[clave];
  if (valor === undefined || valor === null || valor === "") {
    return predeterminado;
  }
  return valor;
};

const host = limpiarHost(
  obtenerEnv(
    "VITE_BACKEND_HOST",
    obtenerEnv("VITE_API_HOST", "http://localhost")
  )
);
const puerto = obtenerEnv(
  "VITE_BACKEND_PORT",
  obtenerEnv("VITE_API_PORT", "80")
);
const basePath = limpiarPath(
  obtenerEnv(
    "VITE_BACKEND_PATH",
    obtenerEnv("VITE_API_PATH", "/cupones/servidor")
  )
);
const baseUrlEnv = obtenerEnv("VITE_API_BASE_URL", "").trim();

const hostTienePuerto = /:\d+$/.test(host.replace(/^https?:\/\//i, ""));
const puertoAplicado = puerto && !hostTienePuerto ? `:${puerto}` : "";
const baseInferida = `${host}${puertoAplicado}${basePath}`;
export const API_BASE_URL = (baseUrlEnv || baseInferida).replace(/\/$/, "");

const endpointCupones = limpiarPath(
  obtenerEnv(
    "VITE_ENDPOINT_CUPONES",
    obtenerEnv("VITE_API_ENDPOINT_CUPONES", "/cupones")
  )
);
const endpointDestacados = limpiarPath(
  obtenerEnv(
    "VITE_ENDPOINT_DESTACADOS",
    obtenerEnv("VITE_API_ENDPOINT_DESTACADOS", "/destacados")
  )
);
const endpointCategorias = limpiarPath(
  obtenerEnv(
    "VITE_ENDPOINT_CATEGORIAS",
    obtenerEnv("VITE_API_ENDPOINT_CATEGORIAS", "/categorias")
  )
);

export const API_ENDPOINTS = {
  cupones: `${API_BASE_URL}${endpointCupones}`,
  destacados: `${API_BASE_URL}${endpointDestacados}`,
  categorias: `${API_BASE_URL}${endpointCategorias}`,
};

export const usarMocks =
  (obtenerEnv("VITE_USAR_MOCKS", "false") ?? "false") === "true";
