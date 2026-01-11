const PiePagina = () => {
  return (
    <footer className="bg-body-tertiary border-top border-light-subtle py-4 mt-auto">
      <div className="container d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
        <p className="mb-0 small">
          © {new Date().getFullYear()} BombCoupons Clone. Construido con React y
          Bootstrap.
        </p>
        <p className="mb-0 small text-body-secondary">
          La API se puede redefinir en <code>src/services/solicitudes.js</code>
        </p>
      </div>
    </footer>
  );
};

export default PiePagina;
