import { useEffect, useState } from "react";
import { FiX, FiStar, FiUsers, FiClock, FiCheck, FiLock } from "react-icons/fi";
import "../ModalCSS.css";
import { FaRegClock } from "react-icons/fa";

const ModalCodigoCupon = ({ cupon, visible, onCerrar }) => {
  const [fase, setFase] = useState("inicio"); // fases: inicio, cargando, verificado
  const [ratingsInflados, setRatingsInflados] = useState(542);
  const [falseExpire, setFalseExpire] = useState(128);
  const [fakeUsed, setFakeUsed] = useState(300);

  useEffect(() => {
    if (!visible) setFase("inicio");
  }, [visible]);

  useEffect(() => {
    if (visible) {
      const genteNueva = Math.floor(Math.random() * 10) + 1;
      setRatingsInflados((prev) => prev + genteNueva);
      setFalseExpire((prev) => (prev > 0 ? prev - 1 : 0));
      setFakeUsed((prev) => prev + genteNueva * 2);
    }
  }, [visible]);

  const iniciarVerificacion = () => {
    setFase("cargando");
    // Simular espera de 30 segundos
    setTimeout(() => {
      setFase("verificado");
    }, 600);
  };

  if (!visible || !cupon) return null;

  const ratingValue = cupon.rating || 5.0;
  const usedToday = cupon.cupones || 0;

  return (
    <div className="custom-modal-overlay" onClick={fase === "inicio" ? onCerrar : null}>
      <div className="custom-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header - Se mantiene siempre según tu petición */}
        <div className="modal-header-section" style={{ backgroundImage: `url(${cupon.img})` }}>
          {/* El botón cerrar solo se muestra en la fase inicial */}
          {fase === "inicio" && (
            <button className="close-btn" onClick={onCerrar}>
              <FiX size={20} />
            </button>
          )}

          <div className="header-content">
            <img src={cupon.img} alt={cupon.img} className="brand-logo" />
            <div className="brand-info">
              <span className="brand-category">{cupon.marca}</span>
              <h2 className="brand-title">{cupon.nombre}</h2>
              <div className="badges">
                <span className="badge-item">
                  <FiClock className="me-1" /> {cupon.cupones} Cupones restantes
                </span>
                <span className="badge-item green">
                  <FiCheck className="me-1" /> {cupon.estado}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENIDO VARIABLE SEGÚN LA FASE */}
        <div className="modal-body-section" style={{ padding: "20px 25px" }}>
          {fase === "inicio" && (
            <>
              <div className="stats-row">
                <div className="stat-item">
                  <FiStar className="stat-icon" />
                  <div className="stat-value">{ratingValue.toFixed(1)}</div>
                  <div className="stat-label">{ratingsInflados} Ratings</div>
                </div>
                <div className="stat-item">
                  <FiUsers className="stat-icon" />
                  <div className="stat-value">{fakeUsed}</div>
                  <div className="stat-label">Used today</div>
                </div>
                <div className="stat-item">
                  <FaRegClock className="stat-icon" />
                  <div className="stat-value">{falseExpire}</div>
                  <div className="stat-label">Expires in</div>
                </div>
              </div>
              <hr className="divider" />
              <div className="details-section">
                <h6>Details</h6>
                <p>{cupon.detalles || cupon.descripcion}</p>
              </div>
              <div className="modal-footer-section" style={{ marginTop: "20px" }}>
                <button className="reveal-btn-full" onClick={iniciarVerificacion}>
                  Show Coupon Code
                </button>
              </div>
            </>
          )}

          {fase === "cargando" && (
            <div className="loading-state" style={{ textAlign: "center", padding: "40px 0" }}>
              <div className="custom-loader"></div>
              <h3 style={{ marginTop: "20px", color: "#fff" }}>Espere un momento...</h3>
              <p style={{ color: "#aaa" }}>Estamos verificando la disponibilidad del cupón.</p>
            </div>
          )}

          {fase === "verificado" && (
            <div className="verified-state" style={{ textAlign: "center" }}>
              <h2 style={{ color: "#fff", fontSize: "1.4rem", marginBottom: "5px" }}>Tu cupon se cuentra listo!</h2>
              <p style={{ color: "#aaa", fontSize: "0.9rem", marginBottom: "20px" }}>Para revelar el codigo debe realizar la siguiente verificación</p>

              <div className="coupon-locked-box">
                <div className="locked-header">
                  <span style={{ color: "#f39c12", fontWeight: "bold", fontSize: "12px" }}>COUPON CODE</span>
                  <span className="locked-badge">
                    <FiLock size={12} /> LOCKED
                  </span>
                </div>
                <div className="blurred-code-text">{cupon.coupon_code}</div>
              </div>

              <button className="get-full-code-btn" onClick={() => window.open(cupon.link, "_blank")}>
                Get Full Code
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalCodigoCupon;
