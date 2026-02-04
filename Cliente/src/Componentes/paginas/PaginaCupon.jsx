import { useParams, useNavigate } from "react-router-dom";
import { FiStar, FiUsers, FiClock, FiCheck, FiTag, FiArrowLeft } from "react-icons/fi";
import { FaRegClock } from "react-icons/fa";

const PaginaCupon = ({ data }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  // IMPORTANTE: Convertimos id a String para que coincida con el valor de la URL
  const cupon = data?.find((item) => String(item.id) === String(id));

  if (!cupon) {
    return (
      <div style={{ color: "white", textAlign: "center", padding: "100px" }}>
        <h2>Cupón no encontrado</h2>
        <button onClick={() => navigate("/")}>Volver al listado</button>
      </div>
    );
  }

  return (
    <div className="coupon-page-container">
      <button className="back-nav-btn" onClick={() => navigate(-1)}>
        <FiArrowLeft size={20} /> Volver
      </button>

      <div className="custom-modal-container static-view">
        {/* Header con imagen dinámica */}
        <div className="modal-header-section" style={{ backgroundImage: `url(${cupon.banner})` }}>
          <div className="header-content">
            <img src={cupon.img} alt={cupon.img} className="brand-logo" />
            <div className="brand-info">
              <span className="brand-category">{cupon.marca}</span>
              <h2 className="brand-title">{cupon.nombre}</h2>
              <div className="badges">
                <span className="badge-item">
                  <FiClock className="me-1" /> {cupon.cupones} Disponibles
                </span>
                <span className="badge-item green">
                  <FiCheck className="me-1" /> {cupon.estado}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-body-section">
          <div className="stats-row">
            <div className="stat-item">
              <FiStar className="stat-icon" />
              <div className="stat-value">{Number(cupon.rating).toFixed(1)}</div>
              <div className="stat-label">Rating</div>
            </div>
            <div className="stat-item">
              <FiUsers className="stat-icon" />
              <div className="stat-value">Activo</div>
              <div className="stat-label">Comunidad</div>
            </div>
            <div className="stat-item">
              <FaRegClock className="stat-icon" />
              <div className="stat-value">Hoy</div>
              <div className="stat-label">Válido</div>
            </div>
          </div>

          <hr className="divider" />

          {/* CÓDIGO SIEMPRE VISIBLE */}
          <div className="verified-state" style={{ textAlign: "center" }}>
            <h3 style={{ color: "#fff", fontSize: "1rem", marginBottom: "15px", letterSpacing: "1px" }}>CÓDIGO DISPONIBLE</h3>

            <div className="coupon-unlocked-box mx-5">
              <div className="revealed-code-display">{cupon.coupon_code}</div>
            </div>
          </div>

          <div className="details-section" style={{ marginTop: "30px" }}>
            <h6 style={{ color: "#fff", fontWeight: "bold" }}>Descripción</h6>
            <p style={{ color: "#bbb", fontSize: "0.95rem", whiteSpace: "pre-line" }}>{cupon.detalles}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginaCupon;
