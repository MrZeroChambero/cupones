const textosFallback = [
  {
    nombre: "Tecnología",
    descripcion: "Accesorios, gadgets y dispositivos conectados.",
  },
  { nombre: "Moda", descripcion: "Ropa urbana y lanzamientos limitados." },
  { nombre: "Hogar", descripcion: "Soluciones eco y decoración." },
  {
    nombre: "Gastronomía",
    descripcion: "Restaurantes y delivery saludable.",
  },
];

const PaginaCategorias = ({
  categorias = [],
  cargando = false,
  error = "",
}) => {
  if (cargando) {
    return (
      <section>
        <p className="text-body-secondary">Descargando categorías...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <p className="text-danger">{error}</p>
      </section>
    );
  }

  const lista = categorias.length ? categorias : textosFallback;

  return (
    <section>
      <div className="mb-4">
        <p className="text-body-secondary small mb-1">Explora por interés</p>
        <h1 className="h4 mb-0">Categorías destacadas</h1>
      </div>
      <div className="row g-3">
        {lista.map((categoria) => (
          <div
            className="col-12 col-md-6"
            key={categoria.id ?? categoria.nombre}
          >
            <article className="categoria-card rounded-4 p-4 h-100">
              <h2 className="h5">{categoria.nombre}</h2>
              <p className="mb-0">{categoria.descripcion}</p>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PaginaCategorias;
