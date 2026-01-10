import { FiCpu, FiLayers, FiTrendingUp } from "react-icons/fi";

const EstadisticasCupones = ({ cupones = [] }) => {
  const total = cupones.length;
  const proximos = cupones.filter(
    (cupon) => cupon.categoria === "Tecnología"
  ).length;
  const categorias = new Set(cupones.map((cupon) => cupon.categoria)).size;

  const estadisticas = [
    { etiqueta: "Cupones activos", valor: total || "—", icono: FiTrendingUp },
    {
      etiqueta: "Categorías cubiertas",
      valor: categorias || "—",
      icono: FiLayers,
    },
    { etiqueta: "Tecnología destacada", valor: proximos || "—", icono: FiCpu },
  ];

  return (
    <section className="estadisticas-cupones rounded-4 p-4 mb-4">
      <div className="row text-center g-3">
        {estadisticas.map((item) => {
          const Icono = item.icono;
          return (
            <div className="col-12 col-md-4" key={item.etiqueta}>
              <p className="display-6 fw-bold mb-0 d-flex align-items-center justify-content-center gap-2">
                <Icono aria-hidden="true" />
                {item.valor}
              </p>
              <p className="text-body-secondary mb-0">{item.etiqueta}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default EstadisticasCupones;
