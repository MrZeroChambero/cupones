import { useEffect, useMemo, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import TarjetaCupon from "./TarjetaCupon";

const INTERVALO_MS = 5000;

const CarruselCupones = ({
  cupones = [],
  cuponesRevelados = [],
  onRevelarCodigo,
}) => {
  const items = useMemo(() => cupones.slice(0, 6), [cupones]);
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
          <p className="text-body-secondary small mb-1">Auto-play</p>
          <h2 className="h5 mb-0">Carrusel de cupones</h2>
        </div>
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-accent btn-sm"
            onClick={() => irA(indice - 1)}
            aria-label="Anterior"
          >
            <FiChevronLeft />
          </button>
          <button
            type="button"
            className="btn btn-outline-accent btn-sm"
            onClick={() => irA(indice + 1)}
            aria-label="Siguiente"
          >
            <FiChevronRight />
          </button>
        </div>
      </div>

      <div className="carrusel-cupones__viewport">
        <div
          className="carrusel-cupones__track"
          style={{ transform: `translateX(-${indice * 100}%)` }}
        >
          {items.map((cupon) => (
            <div className="carrusel-cupones__slide" key={cupon.id}>
              <TarjetaCupon
                cupon={cupon}
                modo="compacto"
                estaRevelado={cuponesRevelados.includes(cupon.id)}
                onRevelar={onRevelarCodigo}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="carrusel-cupones__indicadores d-flex gap-2 justify-content-center mt-3">
        {items.map((cupon, idx) => (
          <button
            key={cupon.id}
            type="button"
            className={`carrusel-cupones__indicador ${
              idx === indice ? "activo" : ""
            }`}
            onClick={() => irA(idx)}
            aria-label={`Ir al cupón ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default CarruselCupones;
