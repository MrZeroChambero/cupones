import { FiClock, FiEye } from "react-icons/fi";

const TarjetaCupon = ({
  cupon,
  estaRevelado,
  onRevelar,
  modo = "completo",
}) => {
  const longitudCodigo = cupon?.codigo?.length ?? 8;
  const codigoEnmascarado = "".padStart(longitudCodigo, "*");

  const clasesArticulo = [
    "tarjeta-cupon bg-panel border border-light-subtle rounded-4 p-4 mb-3 shadow-sm position-relative overflow-hidden",
    modo === "compacto" ? "tarjeta-cupon-compacta" : "tarjeta-cupon-completa",
  ].join(" ");

  return (
    <article className={clasesArticulo}>
      {/* Cabecera con logo y datos básicos */}
      <div className="d-flex align-items-center gap-3 mb-3">
        {cupon?.logo ? (
          <img
            src={cupon.logo}
            alt={`Logo de ${cupon.marca}`}
            className="rounded-4 object-fit-cover"
            width="56"
            height="56"
          />
        ) : (
          <div className="marca-placeholder rounded-4 d-flex align-items-center justify-content-center">
            {cupon?.marca?.[0] ?? "B"}
          </div>
        )}

        <div>
          <p className="mb-0 text-accent fw-semibold small">
            {cupon.categoria}
          </p>
          <h3 className="h6 mb-0">{cupon.marca}</h3>
          <p className="text-body-secondary small mb-0 d-flex align-items-center gap-2">
            <FiClock aria-hidden="true" /> Vence {cupon.expira}
          </p>
        </div>
      </div>

      <p className="mb-3">{cupon.descripcion}</p>

      {/* Zona del código con desenfoque hasta que se revele */}
      <div className="d-flex flex-column flex-md-row align-items-md-center gap-3">
        <span className="codigo-cupon codigo-oculto">{codigoEnmascarado}</span>
        <button
          type="button"
          className="btn btn-accent fw-semibold"
          onClick={() => onRevelar?.(cupon.id, cupon)}
        >
          <span className="d-inline-flex align-items-center gap-2">
            <FiEye aria-hidden="true" />
            {estaRevelado ? "Ver código otra vez" : "Ver código"}
          </span>
        </button>
      </div>
    </article>
  );
};

export default TarjetaCupon;
