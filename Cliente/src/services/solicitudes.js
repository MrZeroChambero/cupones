import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS, usarMocks } from "../config/api";

const BASE_API_URL = usarMocks ? "/api" : API_BASE_URL;

export const ENDPOINTS = usarMocks
  ? {
      cupones: `${BASE_API_URL}/cupones.json`,
      destacados: `${BASE_API_URL}/destacados.json`,
      categorias: `${BASE_API_URL}/categorias.json`,
    }
  : { ...API_ENDPOINTS };

const extraerContenido = (respuestaAxios) => {
  const crudo = respuestaAxios?.data;
  if (
    crudo &&
    typeof crudo === "object" &&
    !Array.isArray(crudo) &&
    Object.prototype.hasOwnProperty.call(crudo, "data")
  ) {
    return crudo.data ?? {};
  }
  return crudo;
};

const extraerListado = (payload, clave) => {
  if (Array.isArray(payload)) {
    return payload;
  }
  if (payload && typeof payload === "object") {
    if (Array.isArray(payload[clave])) {
      return payload[clave];
    }
  }
  return [];
};

const obtenerEtiquetaOrigen = () => (usarMocks ? "MOCK" : "BACKEND");

const registrarSolicitudBackend = (
  descriptor,
  { url, metodo, cuerpo, config }
) => {
  console.log(`[${obtenerEtiquetaOrigen()}] Solicitud ${descriptor}:`, {
    url,
    metodo,
    cuerpo,
    config,
  });
};

const registrarRespuestaBackend = (
  endpoint,
  respuestaCompleta,
  opciones = {}
) => {
  const { esError = false } = opciones;
  const estado = esError ? "Respuesta con error" : "Respuesta";
  const etiqueta = `[${obtenerEtiquetaOrigen()}] ${estado} ${endpoint}`;
  if (!respuestaCompleta) {
    console.log(`${etiqueta}: <sin respuesta>`);
    return;
  }

  const payload = respuestaCompleta.data;
  const rawText = respuestaCompleta.request?.responseText;
  const mensajePrioritario =
    typeof payload === "string"
      ? payload
      : rawText || JSON.stringify(payload, null, 2);

  console.log(`${etiqueta} (detalle principal):`, mensajePrioritario);
  console.log(`${etiqueta} (objeto Axios completo):`, respuestaCompleta);
};

const construirErrorNormalizado = (error) => {
  const respuesta = error?.response;
  const payload = respuesta?.data;
  let mensajeDesdePayload = "";

  if (payload && typeof payload === "object") {
    mensajeDesdePayload = payload.message ?? payload.mensaje ?? "";
  } else if (typeof payload === "string") {
    mensajeDesdePayload = payload.trim();
  }

  const mensaje =
    mensajeDesdePayload ||
    respuesta?.statusText ||
    error.message ||
    "Error desconocido";

  const err = new Error(mensaje);
  if (payload && typeof payload === "object") {
    if (payload.errors || payload.errores) {
      err.detalle = payload.errors ?? payload.errores;
    }
  } else if (typeof payload === "string" && payload.trim()) {
    err.detalle = payload.trim();
  }
  if (respuesta?.status) {
    err.status = respuesta.status;
  }
  if (payload !== undefined) {
    err.payload = payload;
  }
  return err;
};

const manejarError = (error) => {
  throw construirErrorNormalizado(error);
};

const ejecutarSolicitud = async ({
  metodo = "GET",
  endpointKey,
  descriptor,
  cuerpo,
  config,
}) => {
  const url = ENDPOINTS[endpointKey];
  const metodoNormalizado = metodo.toUpperCase();
  registrarSolicitudBackend(descriptor, {
    url,
    metodo: metodoNormalizado,
    cuerpo,
    config,
  });

  try {
    const respuesta =
      metodoNormalizado === "POST"
        ? await axios.post(url, cuerpo, config)
        : await axios.get(url, config);
    registrarRespuestaBackend(descriptor, respuesta);
    return extraerContenido(respuesta);
  } catch (error) {
    if (error?.response) {
      registrarRespuestaBackend(descriptor, error.response, { esError: true });
    }
    console.error(`[${obtenerEtiquetaOrigen()}] Error ${descriptor}`, error);
    manejarError(error);
  }

  return undefined;
};

const consumirListado = async (endpointKey, descriptor, tipoRespuesta) => {
  const contenido = await ejecutarSolicitud({
    metodo: "GET",
    endpointKey,
    descriptor,
  });
  return manejarRespuestas(tipoRespuesta, contenido);
};

// Switch central para estandarizar cada tipo de respuesta usando funciones flecha
const manejarRespuestas = (tipoRespuesta, payload) => {
  switch (tipoRespuesta) {
    case "cupones":
      return extraerListado(payload, "cupones");
    case "destacados":
      return extraerListado(payload, "destacados");
    case "categorias":
      return extraerListado(payload, "categorias");
    case "mensaje":
      return payload?.message ?? payload?.mensaje ?? "Operación completada";
    default:
      return payload;
  }
};

export const obtenerCupones = async () => {
  return consumirListado("cupones", "GET /cupones", "cupones");
};

export const obtenerDestacados = async () => {
  return consumirListado("destacados", "GET /destacados", "destacados");
};

export const obtenerCategorias = async () => {
  if (usarMocks) {
    console.warn("[MOCK] No hay categorias.json, devolviendo []");
    return [];
  }
  return consumirListado("categorias", "GET /categorias", "categorias");
};

export const crearCupon = async (payload) => {
  if (usarMocks) {
    throw new Error("No se pueden crear cupones cuando se usan mocks locales");
  }
  const esFormData =
    typeof FormData !== "undefined" && payload instanceof FormData;
  const configuracion = esFormData
    ? {}
    : {
        headers: { "Content-Type": "application/json" },
      };

  const contenido = await ejecutarSolicitud({
    metodo: "POST",
    endpointKey: "cupones",
    descriptor: "POST /cupones",
    cuerpo: payload,
    config: configuracion,
  });

  if (contenido && typeof contenido === "object") {
    return contenido.cupon ?? null;
  }
  return null;
};
