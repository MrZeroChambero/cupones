import { FiMoon, FiSun } from "react-icons/fi";

const SelectorTema = ({ tema, onCambiarTema }) => {
  const esClaro = tema === "claro";
  const etiqueta = esClaro ? "Activar modo oscuro" : "Activar modo claro";
  const Icono = esClaro ? FiMoon : FiSun;

  return (
    <button type="button" className="btn btn-link text-decoration-none p-2 border-0" onClick={onCambiarTema} style={{ color: "inherit" }}>
      <Icono aria-hidden="true" style={{ fontSize: "1.4rem" }} />
    </button>
  );
};

export default SelectorTema;
