import { FiEye } from "react-icons/fi";
import { PiStarDuotone, PiTicketDuotone } from "react-icons/pi";

const TarjetaCupon = ({ cupon, estaRevelado, onRevelar, modo = "completo" }) => {
  const longitudCodigo = cupon?.codigo?.length ?? 8;
  const codigoEnmascarado = "".padStart(longitudCodigo, "*");

  const clasesArticulo = [
    "tarjeta-cupon bg-panel border border-light-subtle rounded-4 p-4 mb-3 shadow-sm position-relative overflow-hidden d-flex justify-content-between align-items-center",
    -modo === "compacto" ? "tarjeta-cupon-compacta" : "tarjeta-cupon-completa",
  ].join(" ");

  return (
    <article className={clasesArticulo}>
      {/* Cabecera con logo y datos básicos */}
      <div className="d-flex align-items-center gap-3">
        {cupon?.icono ? (
          <img src={cupon.icono} alt={`Logo de ${cupon.marca}`} className="rounded-4 object-fit-cover" width="80" height="80" />
        ) : (
          <div className="marca-placeholder rounded-4 d-flex align-items-center justify-content-center">{cupon?.marca?.[0] ?? "B"}</div>
        )}

        <div>
          <p className="mb-0 text-accent fw-semibold small">{cupon.marca}</p>
          <h3 className="h6 mb-0">{cupon.nombre}</h3>
          <div className="d-flex gap-3 mt-1">
            <p className="text-body-secondary small mb-0 d-flex align-items-center gap-1">
              <PiStarDuotone aria-hidden="true" color="#f97316" size={18} />
              {cupon.rating ? Number(cupon.rating).toFixed(1) : "N/A"}
            </p>
            <p className="text-body-secondary small mb-0 d-flex align-items-center gap-1">
              <PiTicketDuotone aria-hidden="true" color="#f97316" size={18} />
              {cupon.cupones}
            </p>
          </div>
        </div>
      </div>
      {/* Zona del código con desenfoque hasta que se revele */}
      <div className="d-flex flex-column flex-md-row align-items-md-center">
        <button type="button" className="btn btn-revelar-orange btn-responsive-capsule fw-bold" onClick={() => onRevelar?.(cupon.id, cupon)}>
          <FiEye size={20} />
          <span className="btn-text">{estaRevelado ? "Ver código otra vez" : "Ver código"}</span>
        </button>
      </div>
    </article>
  );
};

export default TarjetaCupon;
