import { FiPlay, FiShoppingBag } from "react-icons/fi";

const ReelCupon = ({ cupon, onRevelarCodigo }) => {
  if (!cupon) {
    return null;
  }

  const cuponId = cupon.id ?? cupon.cuponId;

  return (
    <section className="reel-cupon rounded-5 p-4 mb-4 d-flex flex-column flex-md-row gap-4">
      <div className="position-relative flex-grow-1">
        <div className="reel-cupon__media rounded-4" />
        <button type="button" className="reel-cupon__play btn btn-light btn-sm">
          <FiPlay aria-hidden="true" />
        </button>
      </div>
      <div className="flex-grow-1">
        <p className="small text-body-secondary text-uppercase mb-1">
          Reel destacado
        </p>
        <h2 className="h4 mb-2">{cupon.marca}</h2>
        <p className="fs-5 fw-semibold text-accent mb-3">{cupon.descuento}</p>
        <p className="mb-4 text-body-secondary">{cupon.descripcion}</p>
        <div className="d-flex flex-wrap gap-3">
          <button
            type="button"
            className="btn btn-accent"
            onClick={() => onRevelarCodigo?.(cuponId, cupon)}
          >
            <span className="d-inline-flex align-items-center gap-2">
              <FiShoppingBag aria-hidden="true" /> Ver cupón
            </span>
          </button>
          <span className="badge text-bg-dark-subtle">
            Expira {cupon.expira}
          </span>
        </div>
      </div>
    </section>
  );
};

export default ReelCupon;
