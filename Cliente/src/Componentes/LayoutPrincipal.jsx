import { Outlet } from "react-router-dom";
import Encabezado from "./Encabezado";
import BarraLateral from "./BarraLateral";
import PiePagina from "./PiePagina";

const LayoutPrincipal = ({ tema, onCambiarTema, promocionesDestacadas, cargando, error, cuponesRevelados, onRevelarCodigo, onAbrirModalNuevoCupon, setTerminoBusqueda }) => {
  return (
    <div className="layout-principal min-vh-100 d-flex flex-column">
      {/* Cabecera fija con selector de modo */}
      <Encabezado tema={tema} onCambiarTema={onCambiarTema} onAbrirModalNuevoCupon={onAbrirModalNuevoCupon} setTerminoBusqueda={setTerminoBusqueda} />
      {/* Contenido central dividido en columna principal y barra lateral */}
      <div className="flex-grow-1 container-fluid py-4">
        <div className="row g-4">
          <div className="col-12 col-lg-7">
            <Outlet />
          </div>
          <div className="col-12 col-lg-5">
            <BarraLateral promocionesDestacadas={promocionesDestacadas} cargando={cargando} error={error} cuponesRevelados={cuponesRevelados} onRevelarCodigo={onRevelarCodigo} />
          </div>
        </div>
      </div>

      {/* <PiePagina /> */}
    </div>
  );
};

export default LayoutPrincipal;
