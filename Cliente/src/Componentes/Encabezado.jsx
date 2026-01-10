import { NavLink } from "react-router-dom";
import { FiGrid, FiHome, FiTag } from "react-icons/fi";
import SelectorTema from "./SelectorTema";

const Encabezado = ({ tema, onCambiarTema, onAbrirModalNuevoCupon }) => {
  return (
    <header className="bg-body-tertiary border-bottom border-light-subtle sticky-top">
      {/* Barra de navegación principal con enlaces a las rutas definidas en React Router */}
      <nav className="navbar navbar-expand-lg navbar-light container py-3">
        <NavLink to="/" className="navbar-brand fw-bold text-accent">
          BombCoupons CLON
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#menuPrincipal"
          aria-controls="menuPrincipal"
          aria-expanded="false"
          aria-label="Alternar navegación"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="menuPrincipal">
          <ul className="navbar-nav me-auto gap-2">
            <li className="nav-item">
              <NavLink
                to="/"
                className="nav-link d-flex align-items-center gap-2"
              >
                <FiHome aria-hidden="true" />
                Inicio
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/cupones"
                className="nav-link d-flex align-items-center gap-2"
              >
                <FiTag aria-hidden="true" />
                Cupones
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/categorias"
                className="nav-link d-flex align-items-center gap-2"
              >
                <FiGrid aria-hidden="true" />
                Categorías
              </NavLink>
            </li>
            <li className="nav-item d-flex align-items-center">
              <button
                type="button"
                className="btn btn-outline-accent btn-sm fw-semibold ms-lg-2"
                onClick={onAbrirModalNuevoCupon}
              >
                Nuevo registro
              </button>
            </li>
          </ul>
          <SelectorTema tema={tema} onCambiarTema={onCambiarTema} />
        </div>
      </nav>
    </header>
  );
};

export default Encabezado;
