import TarjetaCupon from "./TarjetaCupon";

const ListadoCupones = ({
  cupones,
  cargando,
  error,
  cuponesRevelados,
  onRevelarCodigo,
}) => {
  if (cargando) {
    return (
      <p className="text-body-secondary">
        Descargando descuentos en tiempo real...
      </p>
    );
  }

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  if (!cupones?.length) {
    return (
      <p className="text-body-secondary">
        No se encontraron cupones disponibles.
      </p>
    );
  }

  return (
    <div className="row g-3" id="listado-principal">
      {cupones.map((cupon) => (
        <div className="col-12" key={cupon.id}>
          <TarjetaCupon
            cupon={cupon}
            estaRevelado={cuponesRevelados.includes(cupon.id)}
            onRevelar={onRevelarCodigo}
          />
        </div>
      ))}
    </div>
  );
};

export default ListadoCupones;
