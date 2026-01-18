import { FiRefreshCcw } from "react-icons/fi";
import TarjetaCupon from "./TarjetaCupon";

const BarraLateral = ({ promocionesDestacadas, cargando, error, cuponesRevelados, onRevelarCodigo }) => {
  const contenido = () => {
    // Respuesta dinámica según estado de carga de los nuevos cupones
    if (cargando) {
      return <p className="text-body-secondary">Cargando cupones frescos...</p>;
    }
    if (error) {
      return <p className="text-danger">{error}</p>;
    }
    if (!promocionesDestacadas.length) {
      return <p className="text-body-secondary">Aún no hay cupones nuevos.</p>;
    }

    return promocionesDestacadas.map((cupon) => <TarjetaCupon key={cupon.id} cupon={cupon} estaRevelado={cuponesRevelados.includes(cupon.id)} onRevelar={onRevelarCodigo} modo="compacto" />);
  };

  return (
    <aside className="barra-lateral bg-panel rounded-4 p-4 shadow-lg">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <p className="text-body-secondary small mb-1 d-flex align-items-center gap-2">
            <FiRefreshCcw aria-hidden="true" /> Actualizado en vivo
          </p>
          <h2 className="h5 mb-0">Cupones destacados</h2>
        </div>
      </div>
      {contenido()}
    </aside>
  );
};

export default BarraLateral;
