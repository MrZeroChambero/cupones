import { useEffect, useState } from "react";
import { FiExternalLink, FiX } from "react-icons/fi";

const ModalCodigoCupon = ({ cupon, visible, onCerrar }) => {
  const [codigoVisible, setCodigoVisible] = useState(false);

  useEffect(() => {
    if (!visible) {
      document.body.classList.remove("modal-open");
      document.body.style.paddingRight = "";
      setCodigoVisible(false);
      return;
    }
    document.body.classList.add("modal-open");
    document.body.style.paddingRight = "0px";
    return () => {
      document.body.classList.remove("modal-open");
      document.body.style.paddingRight = "";
      setCodigoVisible(false);
    };
  }, [visible]);

  useEffect(() => {
    setCodigoVisible(false);
  }, [cupon?.id]);

  if (!visible || !cupon) {
    return null;
  }

  const etiquetaDescuento = cupon.descuento || cupon.titulo || "Cupón";
  const longitudCodigo = cupon.codigo?.length ?? 8;
  const codigoEnmascarado = "".padStart(longitudCodigo, "*");
  const codigoMostrado = codigoVisible ? cupon.codigo : codigoEnmascarado;
  const claseCodigo = `codigo-cupon ${
    codigoVisible ? "codigo-visible" : "codigo-oculto"
  }`;

  return (
    <>
      <div
        className="modal fade show d-block"
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content bg-panel border-light-subtle shadow-lg position-relative">
            <button
              type="button"
              className="modal-close-circle"
              aria-label="Cerrar"
              onClick={onCerrar}
            >
              <FiX size={18} />
            </button>
            <div className="modal-header border-0 pt-4 pb-0 ps-4 pe-5">
              <div>
                <p className="text-body-secondary small mb-1">
                  {etiquetaDescuento}
                </p>
                <h5 className="modal-title fw-bold">{cupon.marca}</h5>
              </div>
            </div>
            <div className="modal-body ps-4 pe-5">
              {cupon.descripcion && (
                <p className="mb-3 text-body-secondary">{cupon.descripcion}</p>
              )}
              <div className="d-flex flex-column flex-md-row align-items-md-center gap-3">
                <span className={claseCodigo}>{codigoMostrado}</span>
                {cupon.enlace ? (
                  <a
                    href={cupon.enlace}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-accent"
                    onClick={() => setCodigoVisible(true)}
                  >
                    <span className="d-inline-flex align-items-center gap-2">
                      <FiExternalLink aria-hidden="true" /> Ir a la tienda
                    </span>
                  </a>
                ) : (
                  <button
                    type="button"
                    className="btn btn-accent"
                    onClick={() => setCodigoVisible(true)}
                  >
                    Revelar código
                  </button>
                )}
              </div>
              {cupon.expira && (
                <p className="small text-body-secondary mt-3 mb-0">
                  Válido hasta {cupon.expira}. Usa el botón para abrir el enlace
                  oficial almacenado en la base de datos.
                </p>
              )}
            </div>
            <div className="modal-footer border-0">
              <button
                type="button"
                className="btn btn-outline-accent"
                onClick={onCerrar}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>
  );
};

export default ModalCodigoCupon;
