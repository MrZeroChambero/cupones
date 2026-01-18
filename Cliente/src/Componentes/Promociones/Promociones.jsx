import { useMemo } from "react";
import { FiCamera, FiTrendingUp } from "react-icons/fi";
import Promocion from "./Promocion";
import { useNavigate } from "react-router-dom";

const normalizarListado = (promociones = []) => {
  return promociones
    .map((item, indice) => {
      const id = item.id ?? item.id_Promocion ?? `promo-${indice}-${item.marca ?? item.nombre ?? "anonimo"}`;
      const fechaCreacion = item.fecha_creacion ?? item.fechaCreacion ?? item.creado_en ?? "";
      return {
        id,
        marca: item.marca ?? item.nombre ?? "Marca",
        nombre: item.nombre ?? item.detalles ?? "Promoción destacada",
        detalles: item.detalles ?? item.descripcion ?? "",
        cupones: Number(item.cupones) || 0,
        estado: item.estado ?? "",
        rating: Number(item.rating) || 0,
        img: item.img ?? item.imagen ?? "",
        icono: item.icono ?? "",
        fechaCreacion,
      };
    })
    .sort((a, b) => {
      const fechaA = Date.parse(a.fechaCreacion) || 0;
      const fechaB = Date.parse(b.fechaCreacion) || 0;
      return fechaB - fechaA;
    });
};

const Promociones = ({ promociones = [], onCrearPromocion }) => {
  const navigate = useNavigate();
  const items = useMemo(() => normalizarListado(promociones), [promociones]);

  if (!items.length) {
    return null;
  }

  console.log(items);

  return (
    <section className="reels-promociones rounded-5 p-4 mb-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-2">
        <div>
          <h2 className="h5 mb-0">Campañas que no puedes perder</h2>
          <p className="text-body-secondary small mb-1 d-flex align-items-center gap-2">Promociones de locura</p>
        </div>
        <div className="d-flex flex-wrap gap-2 align-self-start align-self-md-center">
          <span className="badge text-bg-dark-subtle d-inline-flex align-items-center gap-2">
            <FiTrendingUp aria-hidden="true" /> {items.length} activas
          </span>
          {onCrearPromocion && (
            <button type="button" className="btn btn-outline-accent btn-sm" onClick={onCrearPromocion}>
              Nueva promoción
            </button>
          )}
          <button type="button" className="btn btn-outline-accent btn-sm" onClick={() => navigate("/cupones")}>
            Ver todos
          </button>
        </div>
      </div>
      <div className="reels-promociones__track" role="list">
        {items
          .sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion)) // De más reciente a más antigua
          .slice(0, 3)
          .map((promo) => (
            <Promocion key={promo.id} promocion={promo} />
          ))}
      </div>
    </section>
  );
};

export default Promociones;
