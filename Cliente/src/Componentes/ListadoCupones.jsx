import { useState, useMemo } from "react";
import TarjetaCupon from "./TarjetaCupon";

const ListadoCupones = ({ promos = [], busqueda = "", defaultList, cargando, error, cuponesRevelados, onRevelarCodigo }) => {
  const [visible, setVisible] = useState(20);

  console.log(busqueda, "Listado");

  // 1. PROCESAMIENTO COMPLETO: Filtrado + Ordenamiento
  const datosProcesados = useMemo(() => {
    // A. Filtrar
    let resultado = [...promos];

    if (busqueda && busqueda.trim() !== "") {
      const query = busqueda.toLowerCase();
      resultado = resultado.filter((p) => p.nombre?.toLowerCase().includes(query) || p.marca?.toLowerCase().includes(query) || p.detalles?.toLowerCase().includes(query));
    }

    // B. Ordenar (Por número de cupones de mayor a menor)
    return resultado.sort((a, b) => Number(b.cupones) - Number(a.cupones));
  }, [promos, busqueda]);

  // 2. PAGINACIÓN: Aplicar slice sobre los datos ya procesados
  const cuponesVisibles = datosProcesados.slice(0, visible);

  // Manejo de estados de carga y error
  if (cargando) return <p className="text-body-secondary">Descargando descuentos...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  if (!promos.length) return <p className="text-body-secondary">No hay cupones disponibles.</p>;

  // Determinar qué lista iterar
  // Si es defaultList (ej. Home), mostramos todo procesado.
  // Si no (ej. Pagina Cupones), mostramos solo los visibles.
  const listaARenderizar = defaultList ? datosProcesados : cuponesVisibles;

  return (
    <div className="row overflow-y-auto g-2" id="listado-principal" style={{ maxHeight: "500px", overflowX: "hidden" }}>
      {listaARenderizar.length > 0 ? (
        listaARenderizar.map((promo) => (
          <div className="col-12" key={promo.id}>
            <TarjetaCupon cupon={promo} estaRevelado={cuponesRevelados.includes(promo.id)} onRevelar={onRevelarCodigo} />
          </div>
        ))
      ) : (
        <div className="col-12 text-center py-4">
          <p className="text-muted">No se encontraron resultados para "{busqueda}"</p>
        </div>
      )}

      {/* Botón Ver Más: Solo si NO es lista default y hay más elementos */}
      {!defaultList && visible < datosProcesados.length && (
        <div className="col-12 text-center my-3">
          <button className="btn btn-primary w-100 shadow-sm" onClick={() => setVisible((prev) => prev + 20)}>
            Ver más cupones
          </button>
        </div>
      )}
    </div>
  );
};

export default ListadoCupones;
