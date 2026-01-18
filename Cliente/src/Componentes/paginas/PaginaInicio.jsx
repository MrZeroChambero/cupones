import VitrinaCupones from "../VitrinaCupones/VitrinaCupones";
import EstadisticasCupones from "../EstadisticasCupones";
import ListadoCupones from "../ListadoCupones";
import ReelCupon from "../ReelCupon";
import CarruselCupones from "../CarruselCupones";
import Promociones from "../Promociones/Promociones";

const PaginaInicio = ({ destacados, cupones, cargando, error, onRevelarCodigo, cuponesRevelados, promociones = [], onCrearPromocion }) => {
  // Limitamos algunas secciones iniciales para resaltar novedades
  const primerosCupones = cupones.slice(0, 3);
  const reelPrincipal = cupones[0] ?? destacados[0];

  return (
    <>
      <CarruselCupones cupones={cupones} promociones={promociones} cuponesRevelados={cuponesRevelados} onRevelarCodigo={onRevelarCodigo} />
      {/* <VitrinaCupones destacados={destacados} cupones={cupones} cuponesRevelados={cuponesRevelados} onRevelarCodigo={onRevelarCodigo} /> */}
      {/* <ReelCupon cupon={reelPrincipal} onRevelarCodigo={onRevelarCodigo} /> */}
      {/* <EstadisticasCupones cupones={cupones} /> */}

      <Promociones promociones={promociones} onCrearPromocion={onCrearPromocion} />

      <section className="reels-promociones rounded-5 p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="h4 mb-0">Cupones populares</h2>
            <p className="text-body-secondary small mb-1">Recomendados para ti</p>
          </div>
        </div>

        <ListadoCupones promos={promociones} cupones={primerosCupones} cargando={cargando} error={error} cuponesRevelados={cuponesRevelados} onRevelarCodigo={onRevelarCodigo} />
      </section>
    </>
  );
};

export default PaginaInicio;
