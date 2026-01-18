import ListadoCupones from "../ListadoCupones";

const PaginaCupones = ({ promos, busqueda, cupones, cargando, error, cuponesRevelados, onRevelarCodigo }) => {
  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <p className="text-body-secondary small mb-1">Colección completa</p>
          <h1 className="h4 mb-0">Todos los cupones</h1>
        </div>
        <span className="badge text-bg-dark-subtle">{cupones.length} activos</span>
      </div>
      <ListadoCupones
        defaultList={true}
        promos={promos}
        busqueda={busqueda}
        cupones={cupones}
        cargando={cargando}
        error={error}
        cuponesRevelados={cuponesRevelados}
        onRevelarCodigo={onRevelarCodigo}
      />
    </section>
  );
};

export default PaginaCupones;
