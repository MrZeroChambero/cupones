import { FiArrowUpRight, FiStar } from "react-icons/fi";

const formatearEstado = (estado = "") => {
  const limpio = estado.trim().toLowerCase();
  if (!limpio) {
    return "Nuevo";
  }
  return limpio.charAt(0).toUpperCase() + limpio.slice(1);
};

const Promocion = ({ promocion }) => {
  if (!promocion) {
    return null;
  }

  const {
    marca = "Marca",
    nombre = "Promoción destacada",
    detalles = "",
    cupones = 0,
    estado = "",
    rating = 0,
    img = "",
    icono = "",
  } = promocion;

  const estadoLegible = formatearEstado(estado);
  const ratingLegible = rating ? Number(rating).toFixed(1) : "4.5";

  return (
    <article className="reel-promocion-card" role="listitem">
      <div
        className="reel-promocion-card__media"
        style={{ backgroundImage: img ? `url(${img})` : undefined }}
        aria-hidden="true"
      />
      <div className="reel-promocion-card__cuerpo">
        <div className="d-flex align-items-center gap-3 mb-3">
          {icono ? (
            <img
              src={icono}
              alt={`Logo de ${marca}`}
              className="reel-promocion-card__logo"
              width="48"
              height="48"
              loading="lazy"
            />
          ) : (
            <span className="reel-promocion-card__logo reel-promocion-card__logo--placeholder">
              {marca?.[0] ?? "P"}
            </span>
          )}
          <div>
            <p className="small text-body-secondary mb-0">{estadoLegible}</p>
            <h3 className="h6 mb-0">{marca}</h3>
          </div>
          <span className="ms-auto badge text-bg-dark-subtle">
            {cupones} cupones
          </span>
        </div>
        <p className="text-accent fw-semibold mb-1">{nombre}</p>
        {detalles && (
          <p className="small text-body-secondary mb-3">{detalles}</p>
        )}
        <div className="d-flex align-items-center justify-content-between">
          <span className="d-inline-flex align-items-center gap-1 text-body-secondary small">
            <FiStar aria-hidden="true" /> {ratingLegible}
          </span>
          <button
            type="button"
            className="btn btn-link text-decoration-none text-accent p-0"
          >
            <span className="d-inline-flex align-items-center gap-1">
              Ver detalles <FiArrowUpRight aria-hidden="true" />
            </span>
          </button>
        </div>
      </div>
    </article>
  );
};

export default Promocion;
