import { NavLink, useNavigate } from "react-router-dom";
import SelectorTema from "./SelectorTema";
import { useState } from "react";
// Importamos PiArrowLeftBold para el botón de retroceso en móvil
import { PiMagnifyingGlassBold, PiXBold, PiArrowLeftBold } from "react-icons/pi";

const Encabezado = ({ tema, onCambiarTema, setTerminoBusqueda }) => {
  const [valorLocal, setValorLocal] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false); // Estado que faltaba
  const navigate = useNavigate();

  // Función para ejecutar la búsqueda
  const manejarBusqueda = () => {
    if (valorLocal.trim() !== "") {
      setTerminoBusqueda(valorLocal);
      setMobileSearchOpen(false); // Cerramos el buscador en móvil al buscar
      navigate("/cupones");
    }
  };

  // Función para limpiar y reiniciar
  const limpiarBusqueda = () => {
    setValorLocal("");
    setTerminoBusqueda("");
    setMobileSearchOpen(false);
    navigate("/");
  };

  // Manejar el "Enter" en el teclado
  const manejarKeyPress = (e) => {
    if (e.key === "Enter") {
      manejarBusqueda();
    }
  };

  return (
    <header className="header border-bottom sticky-top py-2 bg-body">
      <div className="container">
        <nav className="navbar p-0 d-flex align-items-center justify-content-between" style={{ minHeight: "50px" }}>
          {/* --- 1. LOGO (Se oculta si el buscador móvil está activo) --- */}
          {!mobileSearchOpen && (
            <NavLink to="/" className="navbar-brand d-flex align-items-center" onClick={limpiarBusqueda}>
              <span className="fw-bold text-body">
                <span className="text-warning">🔥</span> BOMBCOUPONS
              </span>
            </NavLink>
          )}

          {/* --- 2. BUSCADOR DINÁMICO --- */}
          <div className={`buscador-wrapper ${mobileSearchOpen ? "active" : ""}`}>
            <div className="input-group buscador-capsula">
              {/* Botón para volver/cerrar (Solo visible en móvil) */}
              {mobileSearchOpen && (
                <button className="btn border-0 shadow-none d-lg-none" onClick={() => setMobileSearchOpen(false)} type="button">
                  <PiArrowLeftBold size={20} />
                </button>
              )}

              <input
                type="text"
                className="form-control border-0 shadow-none"
                placeholder="Buscar nuevos cupones..."
                value={valorLocal}
                onChange={(e) => setValorLocal(e.target.value)}
                onKeyDown={manejarKeyPress}
              />

              {valorLocal && (
                <button className="btn btn-limpiar border-0 shadow-none" type="button" onClick={() => setValorLocal("")}>
                  <PiXBold size={18} />
                </button>
              )}

              <button className="btn btn-buscar shadow-none" type="button" onClick={manejarBusqueda}>
                <PiMagnifyingGlassBold size={20} color="white" />
              </button>
            </div>
          </div>

          {/* --- 3. ACCIONES DERECHA --- */}
          <div className="d-flex align-items-center ms-auto">
            {/* Lupa para abrir buscador en móvil (Solo visible si el buscador está cerrado) */}
            {!mobileSearchOpen && (
              <button className="btn d-lg-none me-2 shadow-none text-body" onClick={() => setMobileSearchOpen(true)}>
                <PiMagnifyingGlassBold size={24} />
              </button>
            )}

            {/* Selector de tema (Se oculta en móvil si el buscador está abierto para ganar espacio) */}
            <div className={mobileSearchOpen ? "d-none d-lg-block" : ""}>
              <SelectorTema tema={tema} onCambiarTema={onCambiarTema} />
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Encabezado;
