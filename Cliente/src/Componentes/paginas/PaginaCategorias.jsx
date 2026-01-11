const PaginaCategorias = () => {
  // Catálogo base que puede alimentarse desde backend cuando esté disponible
  const categorias = [
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

  return (
    <section>
      <div className="mb-4">
        <p className="text-body-secondary small mb-1">Explora por interés</p>
        <h1 className="h4 mb-0">Categorías destacadas</h1>
      </div>
      <div className="row g-3">
        {categorias.map((categoria) => (
          <div className="col-12 col-md-6" key={categoria.nombre}>
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
