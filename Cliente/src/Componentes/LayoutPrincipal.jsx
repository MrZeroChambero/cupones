import { Outlet } from "react-router-dom";
import Encabezado from "./Encabezado";
import BarraLateral from "./BarraLateral";
import PiePagina from "./PiePagina";

const LayoutPrincipal = ({
  tema,
  onCambiarTema,
  nuevosCupones,
  cargando,
  error,
  cuponesRevelados,
  onRevelarCodigo,
  onAbrirModalNuevoCupon,
}) => {
  return (
    <div className="layout-principal min-vh-100 d-flex flex-column">
      {/* Cabecera fija con selector de modo */}
      <Encabezado
        tema={tema}
        onCambiarTema={onCambiarTema}
        onAbrirModalNuevoCupon={onAbrirModalNuevoCupon}
      />

      {/* Contenido central dividido en columna principal y barra lateral */}
      <div className="flex-grow-1 container-fluid py-4">
        <div className="row g-4">
          <div className="col-12 col-lg-8">
            <Outlet />
          </div>
          <div className="col-12 col-lg-4">
            <BarraLateral
              nuevosCupones={nuevosCupones}
              cargando={cargando}
              error={error}
              cuponesRevelados={cuponesRevelados}
              onRevelarCodigo={onRevelarCodigo}
            />
          </div>
        </div>
      </div>

      <PiePagina />
    </div>
  );
};

export default LayoutPrincipal;
