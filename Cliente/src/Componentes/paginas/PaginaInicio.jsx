import VitrinaCupones from "../VitrinaCupones/VitrinaCupones";
import EstadisticasCupones from "../EstadisticasCupones";
import ListadoCupones from "../ListadoCupones";
import ReelCupon from "../ReelCupon";
import CarruselCupones from "../CarruselCupones";

const PaginaInicio = ({
  destacados,
  cupones,
  cargando,
  error,
  onRevelarCodigo,
  cuponesRevelados,
}) => {
  // Limitamos algunas secciones iniciales para resaltar novedades
  const primerosCupones = cupones.slice(0, 3);
  const reelPrincipal = cupones[0] ?? destacados[0];

  return (
    <>
      <VitrinaCupones
        destacados={destacados}
        cupones={cupones}
        cuponesRevelados={cuponesRevelados}
        onRevelarCodigo={onRevelarCodigo}
      />
      <ReelCupon cupon={reelPrincipal} onRevelarCodigo={onRevelarCodigo} />
      <EstadisticasCupones cupones={cupones} />
      <CarruselCupones
        cupones={cupones}
        cuponesRevelados={cuponesRevelados}
        onRevelarCodigo={onRevelarCodigo}
      />

      <section>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <p className="text-body-secondary small mb-1">
              Recomendados para ti
            </p>
            <h2 className="h4 mb-0">Cupones populares</h2>
          </div>
        </div>
        <ListadoCupones
          cupones={primerosCupones}
          cargando={cargando}
          error={error}
          cuponesRevelados={cuponesRevelados}
          onRevelarCodigo={onRevelarCodigo}
        />
      </section>
    </>
  );
};

export default PaginaInicio;
