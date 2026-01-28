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
  obtenerEnv("VITE_BACKEND_HOST", obtenerEnv("VITE_API_HOST"))
);

const basePath = limpiarPath(
  obtenerEnv("VITE_BACKEND_PATH", obtenerEnv("VITE_API_PATH"))
);
const baseUrlEnv = obtenerEnv("VITE_API_BASE_URL").trim();

const puertoAplicado = "";
const baseInferida = `${host}${puertoAplicado}${basePath}`;
export const API_BASE_URL = (baseUrlEnv || baseInferida).replace(/\/$/, "");

const endpointCupones = limpiarPath(obtenerEnv("VITE_ENDPOINT_CUPONES"));
const endpointDestacados = limpiarPath(obtenerEnv("VITE_ENDPOINT_DESTACADOS"));
const endpointCategorias = limpiarPath(obtenerEnv("VITE_ENDPOINT_CATEGORIAS"));
const endpointPromociones = limpiarPath(
  obtenerEnv("VITE_ENDPOINT_PROMOCIONES")
);

export const API_ENDPOINTS = {
  cupones: `${API_BASE_URL}${endpointCupones}`,
  destacados: `${API_BASE_URL}${endpointDestacados}`,
  categorias: `${API_BASE_URL}${endpointCategorias}`,
  promociones: `${API_BASE_URL}${endpointPromociones}`,
};

export const usarMocks =
  (obtenerEnv("VITE_USAR_MOCKS", "false") ?? "false") === "true";
