import { Link } from "react-router-dom";

const PaginaNoEncontrada = () => {
  return (
    <section className="text-center py-5">
      <p className="display-4 fw-bold mb-2">404</p>
      <p className="lead mb-4">No pudimos encontrar esa sección.</p>
      <Link to="/" className="btn btn-accent">
        Regresar al inicio
      </Link>
    </section>
  );
};

export default PaginaNoEncontrada;
