import { useMemo } from "react";
import { FiLayers, FiShield } from "react-icons/fi";
import TarjetaVitrinaCupon from "./TarjetaVitrinaCupon";

const normalizarDestacado = (item) => ({
  id: item.cuponId ?? item.id,
  marca: item.marca ?? item.titulo ?? "Marca destacada",
  descripcion:
    item.copy || item.descripcion || "Cupón destacado listo para usarse.",
  codigo: item.codigo ?? item.cupon ?? "SIN-CODIGO",
  categoria: item.categoria ?? item.etiqueta ?? "Destacado",
  expira: item.expira ?? item.fechaExpira ?? "",
  descuento: item.descuento ?? item.subtitulo ?? "Beneficio exclusivo",
  enlace: item.enlace ?? "",
  logo: item.logo ?? item.imagen ?? "",
});

const seleccionarCuponesVitrina = (destacados = [], cupones = []) => {
  if (destacados.length) {
    return destacados.map(normalizarDestacado);
  }
  if (cupones.length) {
    return cupones.slice(0, 4);
  }
  return [];
};

const VitrinaCupones = ({
  cupones = [],
  destacados = [],
  cuponesRevelados = [],
  onRevelarCodigo,
}) => {
  const tarjetas = useMemo(
    () => seleccionarCuponesVitrina(destacados, cupones),
    [destacados, cupones]
  );

  if (!tarjetas.length) {
    return null;
  }

  return (
    <section className="vitrina-cupones rounded-5 p-4 p-md-5 mb-4">
      <header className="vitrina-cupones__encabezado d-flex flex-column flex-lg-row gap-4 align-items-start align-items-lg-center mb-4">
        <div>
          <p className="text-uppercase text-body-secondary small mb-2 d-flex align-items-center gap-2">
            <FiShield aria-hidden="true" /> Colección verificada
          </p>
          <h1 className="display-6 fw-bold mb-2">
            Todos los cupones destacados
          </h1>
          <p className="text-body-secondary mb-0">
            Inspírate con las ofertas mejor valoradas y obtén el código sin
            salir de esta página. Cada tarjeta respeta el modo claro/oscuro y se
            adapta automáticamente a cualquier pantalla.
          </p>
        </div>
        <div className="vitrina-cupones__resumen d-flex flex-wrap gap-3">
          <div className="vitrina-metrica">
            <span className="text-body-secondary small">Cupones activos</span>
            <strong>{cupones.length || tarjetas.length}</strong>
          </div>
          <div className="vitrina-metrica">
            <span className="text-body-secondary small">
              Secciones renderizadas
            </span>
            <strong>{tarjetas.length}</strong>
          </div>
          <div className="vitrina-metrica d-inline-flex align-items-center gap-2">
            <FiLayers aria-hidden="true" />
            <div>
              <span className="text-body-secondary small d-block">
                Diseño responsivo
              </span>
              <strong>Listo</strong>
            </div>
          </div>
        </div>
      </header>

      <div className="vitrina-cupones__grid">
        {tarjetas.map((item) => (
          <TarjetaVitrinaCupon
            key={item.id}
            cupon={item}
            estaRevelado={cuponesRevelados.includes(item.id)}
            onRevelar={onRevelarCodigo}
          />
        ))}
      </div>
    </section>
  );
};

export default VitrinaCupones;
