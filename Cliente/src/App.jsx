import { useEffect, useMemo, useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import LayoutPrincipal from "./Componentes/LayoutPrincipal";
import PaginaInicio from "./Componentes/paginas/PaginaInicio";
import PaginaCupones from "./Componentes/paginas/PaginaCupones";
import PaginaCategorias from "./Componentes/paginas/PaginaCategorias";
import PaginaNoEncontrada from "./Componentes/paginas/PaginaNoEncontrada";
import ModalCodigoCupon from "./Componentes/ModalCodigoCupon";
import ModalNuevoCupon from "./Componentes/ModalNuevoCupon";
import CrearPromocion from "./Componentes/CrearPromocion/CrearPromocion";
import {
  obtenerCupones,
  obtenerDestacados,
  obtenerCategorias,
  crearCupon,
  obtenerPromociones,
  crearPromocion,
} from "./services/solicitudes";
const TEMA_STORAGE_KEY = "bombcoupons-tema";

const obtenerTemaPreferido = () => {
  if (typeof window === "undefined") {
    return "claro";
  }
  const temaGuardado = window.localStorage.getItem(TEMA_STORAGE_KEY);
  if (temaGuardado === "claro" || temaGuardado === "oscuro") {
    return temaGuardado;
  }
  const prefiereOscuro = window.matchMedia?.(
    "(prefers-color-scheme: dark)"
  ).matches;
  return prefiereOscuro ? "oscuro" : "claro";
};

function App() {
  const [tema, setTema] = useState(obtenerTemaPreferido);
  const [cupones, setCupones] = useState([]);
  const [destacados, setDestacados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [promociones, setPromociones] = useState([]);
  const [estadoCarga, setEstadoCarga] = useState({ cargando: true, error: "" });
  const [cuponesRevelados, setCuponesRevelados] = useState([]);
  const [cuponActivo, setCuponActivo] = useState(null);
  const [modalNuevoCuponAbierto, setModalNuevoCuponAbierto] = useState(false);
  const [creandoCupon, setCreandoCupon] = useState(false);
  const [modalNuevaPromocionAbierto, setModalNuevaPromocionAbierto] =
    useState(false);
  const [creandoPromocion, setCreandoPromocion] = useState(false);

  useEffect(() => {
    // Reflejamos el modo en data-tema y en data-bs-theme para sincronizar Bootstrap
    document.documentElement.dataset.tema = tema;
    document.documentElement.setAttribute(
      "data-bs-theme",
      tema === "oscuro" ? "dark" : "light"
    );
    if (typeof window !== "undefined") {
      window.localStorage.setItem(TEMA_STORAGE_KEY, tema);
    }
  }, [tema]);

  useEffect(() => {
    // Descargamos cupones y destacados en paralelo mediante axios
    const cargarDatos = async () => {
      try {
        setEstadoCarga({ cargando: true, error: "" });
        const [
          listaCupones,
          listaDestacados,
          listaCategorias,
          listaPromociones,
        ] = await Promise.all([
          obtenerCupones(),
          obtenerDestacados(),
          obtenerCategorias(),
          obtenerPromociones(),
        ]);
        setCupones(listaCupones);
        setDestacados(listaDestacados);
        setCategorias(listaCategorias);
        setPromociones(listaPromociones);
      } catch (error) {
        console.error("Fallo al cargar datos desde el backend", error);
        setEstadoCarga({
          cargando: false,
          error:
            "Ocurrió un error en el backend. Revisa la consola para más detalles.",
        });
        return;
      }
      setEstadoCarga({ cargando: false, error: "" });
    };
    cargarDatos();
  }, []);

  const nuevosCupones = useMemo(() => cupones.slice(0, 4), [cupones]);

  const alternarTema = () => {
    setTema((prevTema) => (prevTema === "claro" ? "oscuro" : "claro"));
  };

  const construirCuponParaModal = (cuponId, fallback) => {
    if (fallback) {
      const cupCompleto = cupones.find((cupon) => cupon.id === cuponId);
      return cupCompleto ? { ...cupCompleto, ...fallback } : fallback;
    }
    const cup = cupones.find((cupon) => cupon.id === cuponId);
    if (cup) {
      return cup;
    }
    const destacadoRelacionado = destacados.find(
      (item) => item.cuponId === cuponId || item.id === cuponId
    );
    if (destacadoRelacionado) {
      return {
        id: cuponId,
        marca: destacadoRelacionado.marca,
        descripcion: destacadoRelacionado.copy,
        codigo: destacadoRelacionado.codigo,
        expira: destacadoRelacionado.expira,
        descuento: destacadoRelacionado.descuento,
        enlace: destacadoRelacionado.enlace ?? "",
      };
    }
    return null;
  };

  const manejarCodigoVisible = (cuponId, fallback = null) => {
    setCuponesRevelados((prev) =>
      prev.includes(cuponId) ? prev : [...prev, cuponId]
    );
    const cuponSeleccionado = construirCuponParaModal(cuponId, fallback);
    setCuponActivo(cuponSeleccionado ?? null);
  };

  const cerrarModalCupon = () => setCuponActivo(null);
  const abrirModalNuevoCupon = () => setModalNuevoCuponAbierto(true);
  const cerrarModalNuevoCupon = () => setModalNuevoCuponAbierto(false);
  const abrirModalNuevaPromocion = () => setModalNuevaPromocionAbierto(true);
  const cerrarModalNuevaPromocion = () => setModalNuevaPromocionAbierto(false);

  const manejarCrearCupon = async (datosCupon) => {
    setCreandoCupon(true);
    try {
      const cuponCreado = await crearCupon(datosCupon);
      if (cuponCreado) {
        setCupones((prev) => [cuponCreado, ...prev]);
        setModalNuevoCuponAbierto(false);
        setCuponActivo(cuponCreado);
      }
    } catch (error) {
      throw error;
    } finally {
      setCreandoCupon(false);
    }
  };

  const manejarCrearPromocion = async (datosPromocion) => {
    setCreandoPromocion(true);
    try {
      const promocionCreada = await crearPromocion(datosPromocion);
      if (promocionCreada) {
        setPromociones((prev) => [promocionCreada, ...prev]);
        setModalNuevaPromocionAbierto(false);
      }
    } finally {
      setCreandoPromocion(false);
    }
  };

  return (
    <>
      <Routes>
        <Route
          element={
            <LayoutPrincipal
              tema={tema}
              onCambiarTema={alternarTema}
              nuevosCupones={nuevosCupones}
              cargando={estadoCarga.cargando}
              error={estadoCarga.error}
              cuponesRevelados={cuponesRevelados}
              onRevelarCodigo={manejarCodigoVisible}
              onAbrirModalNuevoCupon={abrirModalNuevoCupon}
            />
          }
        >
          <Route
            index
            element={
              <PaginaInicio
                destacados={destacados}
                cupones={cupones}
                cargando={estadoCarga.cargando}
                error={estadoCarga.error}
                onRevelarCodigo={manejarCodigoVisible}
                cuponesRevelados={cuponesRevelados}
                promociones={promociones}
                onCrearPromocion={abrirModalNuevaPromocion}
              />
            }
          />
          <Route
            path="/cupones"
            element={
              <PaginaCupones
                cupones={cupones}
                cargando={estadoCarga.cargando}
                error={estadoCarga.error}
                cuponesRevelados={cuponesRevelados}
                onRevelarCodigo={manejarCodigoVisible}
              />
            }
          />
          <Route
            path="/categorias"
            element={
              <PaginaCategorias
                categorias={categorias}
                cargando={estadoCarga.cargando}
                error={estadoCarga.error}
              />
            }
          />
          <Route path="*" element={<PaginaNoEncontrada />} />
        </Route>
      </Routes>
      <ModalCodigoCupon
        cupon={cuponActivo}
        visible={Boolean(cuponActivo)}
        onCerrar={cerrarModalCupon}
      />
      <ModalNuevoCupon
        visible={modalNuevoCuponAbierto}
        categorias={categorias}
        enProceso={creandoCupon}
        onCerrar={cerrarModalNuevoCupon}
        onGuardar={manejarCrearCupon}
      />
      <CrearPromocion
        visible={modalNuevaPromocionAbierto}
        enProceso={creandoPromocion}
        onCerrar={cerrarModalNuevaPromocion}
        onGuardar={manejarCrearPromocion}
      />
    </>
  );
}

export default App;
