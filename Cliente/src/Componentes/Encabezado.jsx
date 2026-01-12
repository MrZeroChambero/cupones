import { NavLink } from "react-router-dom";
import { FiGrid, FiHome, FiTag } from "react-icons/fi";
import SelectorTema from "./SelectorTema";

const Encabezado = ({ tema, onCambiarTema, onAbrirModalNuevoCupon }) => {
  return (
    <header className="header border-bottom sticky-top py-2">
      <div className="container">
        <nav className="navbar p-0 d-flex align-items-center">
          {/* 1. LOGO */}
          <NavLink to="/" className="navbar-brand d-flex align-items-center me-auto me-lg-4">
            <span className="fw-bold text-body">
              <span className="text-warning">🔥</span> BOMBCOUPONS
            </span>
          </NavLink>

          {/* 2. BUSCADOR (Se adapta a dark/light) */}
          <div className="flex-grow-1 d-flex justify-content-center px-2 px-md-5">
            <input type="text" className="form-control barra-de-busqueda " placeholder="Search coupons & brands" style={{ color: "inherit" }} />
          </div>

          {/* 3. SELECTOR DE TEMA (Extremo derecho) */}
          <div className="ms-auto ms-lg-4">
            <SelectorTema tema={tema} onCambiarTema={onCambiarTema} />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Encabezado;
