import { FiMoon, FiSun } from "react-icons/fi";

const SelectorTema = ({ tema, onCambiarTema }) => {
  const esClaro = tema === "claro";
  const etiqueta = esClaro ? "Activar modo oscuro" : "Activar modo claro";
  const Icono = esClaro ? FiMoon : FiSun;

  return (
    <button
      type="button"
      className="btn btn-outline-accent rounded-pill fw-semibold"
      onClick={onCambiarTema}
    >
      <span className="d-inline-flex align-items-center gap-2">
        <Icono aria-hidden="true" />
        {etiqueta}
      </span>
    </button>
  );
};

export default SelectorTema;
