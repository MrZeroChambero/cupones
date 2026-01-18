import { useEffect, useMemo, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import TarjetaCupon from "./TarjetaCupon";

const INTERVALO_MS = 5000;

const CarruselCupones = ({ cupones = [], cuponesRevelados = [], onRevelarCodigo, promociones = [] }) => {
  const items = useMemo(() => promociones.slice(0, 6), [promociones]);
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    if (!items.length) return undefined;
    const id = setInterval(() => {
      setIndice((prev) => (prev + 1) % items.length);
    }, INTERVALO_MS);
    return () => clearInterval(id);
  }, [items.length]);

  if (!items.length) {
    return null;
  }

  const irA = (nuevoIndice) => {
    if (!items.length) return;
    const total = items.length;
    const posicion = (nuevoIndice + total) % total;
    setIndice(posicion);
  };

  return (
    <section className="carrusel-cupones rounded-4 p-4 mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="h5 mb-0">Nuevas promociones</h2>
          <p className="text-body-secondary small mb-1">Lo mejor que nos acaba de llegar</p>
        </div>
        <div className="d-flex gap-3 align-items-center">
          <button type="button" className="btn btn-outline-accent btn-nav-custom" onClick={() => irA(indice - 1)} aria-label="Anterior">
            <FiChevronLeft size={20} />
          </button>
          <button type="button" className="btn btn-outline-accent btn-nav-custom" onClick={() => irA(indice + 1)} aria-label="Siguiente">
            <FiChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="carrusel-cupones__viewport">
        <div className="carrusel-cupones__track" style={{ transform: `translateX(-${indice * 100}%)` }}>
          {items.map((cupon) => {
            return (
              <div className="carrusel-cupones__slide" key={cupon.id}>
                <TarjetaCupon cupon={cupon} modo="compacto" estaRevelado={cuponesRevelados.includes(cupon.id)} onRevelar={onRevelarCodigo} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="carrusel-cupones__indicadores d-flex gap-2 justify-content-center mt-3">
        {items.map((cupon, idx) => (
          <button key={cupon.id} type="button" className={`carrusel-cupones__indicador ${idx === indice ? "activo" : ""}`} onClick={() => irA(idx)} aria-label={`Ir al cupón ${idx + 1}`} />
        ))}
      </div>
    </section>
  );
};

export default CarruselCupones;
