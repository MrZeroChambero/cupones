import { FiClock, FiStar, FiZap } from "react-icons/fi";

const calcularDiasRestantes = (fechaIso) => {
  if (!fechaIso) {
    return null;
  }
  const hoy = new Date();
  const objetivo = new Date(fechaIso);
  if (Number.isNaN(objetivo.getTime())) {
    return null;
  }
  const diff = objetivo.getTime() - hoy.setHours(0, 0, 0, 0);
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const generarNumeroPseudo = (id, min, max) => {
  const base = typeof id === "number" ? id : Number.parseInt(id, 10) || 7;
  const rango = max - min;
  return min + ((base * 53) % rango);
};

const obtenerIniciales = (marca = "?") => {
  return marca
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((palabra) => palabra.charAt(0).toUpperCase())
    .join("")
    .padEnd(2, "∙");
};

const resumirDescripcion = (texto = "") => {
  if (texto.length <= 90) {
    return texto;
  }
  return `${texto.slice(0, 87).trim()}…`;
};

const generarValoracion = (id) => {
  const base = generarNumeroPseudo(id, 45, 50) / 10;
  return base.toFixed(1);
};

const TarjetaVitrinaCupon = ({ cupon, estaRevelado, onRevelar }) => {
  if (!cupon) {
    return null;
  }

  const diasRestantes = calcularDiasRestantes(cupon.expira);
  const usosHoy = generarNumeroPseudo(cupon.id, 18, 95);
  const cuponesRestantes = generarNumeroPseudo(cupon.id, 120, 480);
  const categoria = cupon.categoria || cupon.etiqueta || "General";
  const valoracion = cupon.valoracion || generarValoracion(cupon.id) || "5.0";
  const descripcion = resumirDescripcion(
    cupon.descripcion || cupon.copy || "Cupón verificado y listo para usar."
  );
  const descuento = cupon.descuento || "Beneficio exclusivo";
  const expiraTexto = (() => {
    if (diasRestantes === null) {
      return "Disponible";
    }
    if (diasRestantes <= 0) {
      return "Expira hoy";
    }
    return `Expira en ${diasRestantes} día${diasRestantes === 1 ? "" : "s"}`;
  })();

  return (
    <article className="tarjeta-vitrina rounded-4 p-3 p-md-4 h-100 d-flex flex-column">
      <div className="tarjeta-vitrina__chips d-flex justify-content-between align-items-center gap-2 mb-3">
        <span className="tarjeta-vitrina__chip categoria">{categoria}</span>
        <span className="tarjeta-vitrina__chip valoracion d-inline-flex align-items-center gap-1">
          <FiStar aria-hidden="true" /> {valoracion}
        </span>
      </div>

      <div className="tarjeta-vitrina__marca d-flex align-items-center gap-3 mb-3">
        {cupon.logo ? (
          <img
            src={cupon.logo}
            alt={`Logo de ${cupon.marca}`}
            className="tarjeta-vitrina__logo"
            loading="lazy"
          />
        ) : (
          <div className="tarjeta-vitrina__logo tarjeta-vitrina__logo--placeholder">
            {obtenerIniciales(cupon.marca)}
          </div>
        )}
        <div>
          <p className="text-body-secondary small mb-1">{cupon.marca}</p>
          <h3 className="h5 mb-0">{descuento}</h3>
        </div>
      </div>

      <p className="tarjeta-vitrina__descripcion mb-4 flex-grow-1">
        {descripcion}
      </p>

      <div className="tarjeta-vitrina__estado d-flex flex-column gap-2 mb-3">
        <div className="d-flex justify-content-between">
          <span className="d-inline-flex align-items-center gap-2">
            <FiZap aria-hidden="true" /> {cuponesRestantes} cupones disponibles
          </span>
          <span className="text-body-secondary small">
            Código: {cupon.codigo || "No definido"}
          </span>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <span className="d-inline-flex align-items-center gap-2">
            <FiClock aria-hidden="true" /> {expiraTexto}
          </span>
          <span className="text-body-secondary small">{usosHoy} usos hoy</span>
        </div>
      </div>

      <button
        type="button"
        className="btn btn-accent w-100 mt-auto"
        onClick={() => onRevelar?.(cupon.id, cupon)}
      >
        {estaRevelado ? "Ver detalles" : "Obtener código"}
      </button>
    </article>
  );
};

export default TarjetaVitrinaCupon;
