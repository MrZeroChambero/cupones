import axios from "axios";

// Permite forzar mocks desde .env (útil para desarrollo sin backend)
const usaMocksLocales = (import.meta.env.VITE_USAR_MOCKS ?? "false") === "true";

const limpiarHost = (host) => host.replace(/\/+$/, "");
const asegurarPath = (ruta) => {
  if (!ruta) return "/cupones/servidor";
  return ruta.startsWith("/") ? ruta : `/${ruta}`;
};

const apiHost = limpiarHost(import.meta.env.VITE_API_HOST || "http://localhost");
const apiPort = import.meta.env.VITE_API_PORT || "80";
const apiPath = asegurarPath(import.meta.env.VITE_API_PATH || "/cupones/servidor");
const hostYaTienePuerto = /:\d+$/.test(apiHost.replace(/^https?:\/\//i, ""));
const puertoFinal = apiPort && !hostYaTienePuerto ? `:${apiPort}` : "";
const baseInferida = `${apiHost}${puertoFinal}${apiPath}`;

// Si no se define VITE_API_BASE_URL se construye usando host + puerto + path
const baseBackend = (import.meta.env.VITE_API_BASE_URL || baseInferida).replace(/\/+$/, "");

// La base final dependerá de si usamos mocks o la API real
const BASE_API_URL = usaMocksLocales ? "/api" : baseBackend;

export const ENDPOINTS = {
  cupones: usaMocksLocales ? `${BASE_API_URL}/cupones.json` : `${BASE_API_URL}/cupones`,
  destacados: usaMocksLocales ? `${BASE_API_URL}/destacados.json` : `${BASE_API_URL}/destacados`,
  categorias: usaMocksLocales ? `${BASE_API_URL}/categorias.json` : `${BASE_API_URL}/categorias`,
};

const obtenerEtiquetaOrigen = () => (usaMocksLocales ? "MOCK" : "BACKEND");

const registrarSolicitudBackend = (endpoint, url) => {
  console.info(`[${obtenerEtiquetaOrigen()}] Solicitud ${endpoint}: ${url}`);
};

const registrarRespuestaBackend = (endpoint, data) => {
  // Logging informativo para verificar lo que responde el backend real o los mocks locales
  console.info(`[${obtenerEtiquetaOrigen()}] Respuesta ${endpoint}:`, data);
};

// Switch central para estandarizar cada tipo de respuesta usando funciones flecha
const manejarRespuestas = (tipoRespuesta, payload) => {
  switch (tipoRespuesta) {
    case "cupones": {
      const formatearCupones = () => (Array.isArray(payload?.cupones) ? payload.cupones : []);
      return formatearCupones();
    }
    case "destacados": {
      const organizarDestacados = () => (Array.isArray(payload?.destacados) ? payload.destacados : []);
      return organizarDestacados();
    }
    case "mensaje": {
      const devolverMensaje = () => payload?.mensaje ?? "Operación completada";
      return devolverMensaje();
    }
    default: {
      const retornoSeguro = () => payload;
      return retornoSeguro();
    }
  }
};

const manejarError = (error) => {
  // Generamos un Error con el contrato que espera la UI para mostrar alertas
  const construirError = () => {
    const mensaje = error?.response?.data?.mensaje || error.message || "Error desconocido";
    const err = new Error(mensaje);
    if (error?.response?.data?.errores) {
      err.detalle = error.response.data.errores;
    }
    if (error?.response?.status) {
      err.status = error.response.status;
    }
    return err;
  };
  throw construirError();
};

export const obtenerCupones = async () => {
  try {
    registrarSolicitudBackend("GET /cupones", ENDPOINTS.cupones);
    const respuesta = await axios.get(ENDPOINTS.cupones);
    registrarRespuestaBackend("GET /cupones", respuesta.data);
    return manejarRespuestas("cupones", respuesta.data);
  } catch (error) {
    console.error(`[${obtenerEtiquetaOrigen()}] Error GET /cupones`, error);
    manejarError(error);
  }
};

export const obtenerDestacados = async () => {
  try {
    registrarSolicitudBackend("GET /destacados", ENDPOINTS.destacados);
    const respuesta = await axios.get(ENDPOINTS.destacados);
    registrarRespuestaBackend("GET /destacados", respuesta.data);
    return manejarRespuestas("destacados", respuesta.data);
  } catch (error) {
    console.error(`[${obtenerEtiquetaOrigen()}] Error GET /destacados`, error);
    manejarError(error);
  }
};

export const obtenerCategorias = async () => {
  if (usaMocksLocales) {
    console.warn("[MOCK] No hay categorias.json, devolviendo []");
    return [];
  }
  try {
    registrarSolicitudBackend("GET /categorias", ENDPOINTS.categorias);
    const respuesta = await axios.get(ENDPOINTS.categorias);
    registrarRespuestaBackend("GET /categorias", respuesta.data);
    return Array.isArray(respuesta?.data?.categorias) ? respuesta.data.categorias : [];
  } catch (error) {
    console.error(`[${obtenerEtiquetaOrigen()}] Error GET /categorias`, error);
    manejarError(error);
  }
};

export const crearCupon = async (payload) => {
  if (usaMocksLocales) {
    throw new Error("No se pueden crear cupones cuando se usan mocks locales");
  }
  try {
    registrarSolicitudBackend("POST /cupones", ENDPOINTS.cupones);
    const esFormData = typeof FormData !== "undefined" && payload instanceof FormData;
    const configuracion = esFormData
      ? {}
      : {
          headers: { "Content-Type": "application/json" },
        };
    const respuesta = await axios.post(ENDPOINTS.cupones, payload, configuracion);
    registrarRespuestaBackend("POST /cupones", respuesta.data);
    return respuesta?.data?.cupon ?? null;
  } catch (error) {
    console.error(`[${obtenerEtiquetaOrigen()}] Error POST /cupones`, error);
    manejarError(error);
  }
};
