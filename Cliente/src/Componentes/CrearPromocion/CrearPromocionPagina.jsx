import { useState } from "react";
import { FiImage, FiUpload, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom"; // Importante para la navegación

const ESTADOS_DISPONIBLES = [
  { value: "disponible", label: "Disponible" },
  { value: "agotándose", label: "Agotándose" },
  { value: "nuevo", label: "Nuevo" },
];

const inicialFormulario = {
  marca: "",
  nombre: "",
  detalles: "",
  cupones: "1",
  estado: ESTADOS_DISPONIBLES[0].value,
  img: "",
  rating: "4.5",
  coupon_code: "",
  fecha_creacion: new Date().toISOString().split("T")[0], // formato YYYY-MM-DD para input type="date"
};

const CrearPromocionPagina = ({ enProceso = false, onGuardar }) => {
  const navigate = useNavigate();
  const [formulario, setFormulario] = useState(inicialFormulario);

  const [errores, setErrores] = useState({});
  const [mensajeGeneral, setMensajeGeneral] = useState("");
  const [mostrarModalExito, setMostrarModalExito] = useState(false);

  const actualizarCampo = (campo, valor) => {
    setFormulario((prev) => ({ ...prev, [campo]: valor }));
  };

  const validar = () => {
    const nuevosErrores = {};
    const requerido = ["marca", "nombre", "detalles"];
    requerido.forEach((campo) => {
      if (!formulario[campo]?.trim()) {
        nuevosErrores[campo] = "Este campo es obligatorio.";
      }
    });

    const cupones = Number(formulario.cupones);
    if (!Number.isInteger(cupones) || cupones < 1) {
      nuevosErrores.cupones = "Ingresa un número entero positivo.";
    }

    const rating = Number(formulario.rating);
    if (Number.isNaN(rating) || rating < 0 || rating > 5) {
      nuevosErrores.rating = "El rating debe estar entre 0 y 5.";
    }

    if (formulario.coupon_code && formulario.coupon_code.length > 1000) {
      nuevosErrores.coupon_code = "Máximo 1000 caracteres.";
    }

    // Validar fecha_creacion (debe ser una fecha válida YYYY-MM-DD)
    if (!formulario.fecha_creacion) {
      nuevosErrores.fecha_creacion = "Selecciona la fecha de creación.";
    } else {
      const ts = Date.parse(formulario.fecha_creacion);
      if (Number.isNaN(ts)) {
        nuevosErrores.fecha_creacion = "Fecha inválida.";
      }
    }


    return nuevosErrores;
  };

  const manejarSubmit = async (evento) => {
    evento.preventDefault();
    const nuevosErrores = validar();
    if (Object.keys(nuevosErrores).length) {
      setErrores(nuevosErrores);
      setMensajeGeneral("");
      return;
    }

    setErrores({});
    setMensajeGeneral("");
    const payload = new FormData();
    Object.entries(formulario).forEach(([clave, valor]) => {
      payload.append(clave, valor);
    });

    try {
      await onGuardar?.(payload);
      // Opcional: navegar a la lista después de guardar con éxito
      // navigate("/promociones");
      setMostrarModalExito(true);
    } catch (error) {
      const mensaje = error?.message ?? "No se pudo guardar la promoción.";
      setMensajeGeneral(mensaje);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          {/* Cabecera de la página */}
          <div className="d-flex align-items-center gap-3 mb-4">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm rounded-circle"
              onClick={() => navigate(-1)}
              title="Volver"
            >
              <FiArrowLeft size={18} />
            </button>
            <div>
              <p className="text-body-secondary small mb-0">Administración</p>
              <h2 className="h4 fw-bold mb-0">Crear campaña destacada</h2>
            </div>
          </div>

          <div className="card bg-panel border-light-subtle shadow-sm">
            <form className="card-body p-4 p-md-5" onSubmit={manejarSubmit}>
              {mensajeGeneral && (
                <div className="alert alert-danger mb-4" role="alert">
                  {mensajeGeneral}
                </div>
              )}

              <div className="row g-4">
                <div className="col-md-6">
                  <label
                    className="form-label fw-semibold"
                    htmlFor="marca-promocion"
                  >
                    Marca
                  </label>
                  <input
                    id="marca-promocion"
                    type="text"
                    className={`form-control ${
                      errores.marca ? "is-invalid" : ""
                    }`}
                    value={formulario.marca}
                    onChange={(e) => actualizarCampo("marca", e.target.value)}
                    placeholder="Ej. ShopiTech"
                  />
                  {errores.marca && (
                    <div className="invalid-feedback">{errores.marca}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label
                    className="form-label fw-semibold"
                    htmlFor="nombre-promocion"
                  >
                    Nombre comercial
                  </label>
                  <input
                    id="nombre-promocion"
                    type="text"
                    className={`form-control ${
                      errores.nombre ? "is-invalid" : ""
                    }`}
                    value={formulario.nombre}
                    onChange={(e) => actualizarCampo("nombre", e.target.value)}
                    placeholder="Ej. Semana Gamer"
                  />
                  {errores.nombre && (
                    <div className="invalid-feedback">{errores.nombre}</div>
                  )}

                  <div className="mt-3">
                    <label
                      className="form-label fw-semibold"
                      htmlFor="coupon-code-promocion"
                    >
                      Código del cupón
                    </label>
                    <input
                      id="coupon-code-promocion"
                      type="text"
                      maxLength={255}
                      className={`form-control ${
                        errores.coupon_code ? "is-invalid" : ""
                      }`}
                      value={formulario.coupon_code}
                      onChange={(e) =>
                        actualizarCampo("coupon_code", e.target.value)
                      }
                      placeholder="Ej. DESC2026"
                    />
                    {errores.coupon_code && (
                      <div className="invalid-feedback">
                        {errores.coupon_code}
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-12">
                  <label
                    className="form-label fw-semibold"
                    htmlFor="detalles-promocion"
                  >
                    Detalles
                  </label>
                  <textarea
                    id="detalles-promocion"
                    className={`form-control ${
                      errores.detalles ? "is-invalid" : ""
                    }`}
                    rows={4}
                    value={formulario.detalles}
                    onChange={(e) =>
                      actualizarCampo("detalles", e.target.value)
                    }
                    placeholder="Describe los beneficios principales de la promoción..."
                  />
                  {errores.detalles && (
                    <div className="invalid-feedback">{errores.detalles}</div>
                  )}
                </div>

                <div className="col-md-3">
                  <label
                    className="form-label fw-semibold"
                    htmlFor="cupones-promocion"
                  >
                    Cupones activos
                  </label>
                  <input
                    id="cupones-promocion"
                    type="number"
                    className={`form-control ${
                      errores.cupones ? "is-invalid" : ""
                    }`}
                    value={formulario.cupones}
                    onChange={(e) => actualizarCampo("cupones", e.target.value)}
                  />
                  {errores.cupones && (
                    <div className="invalid-feedback">{errores.cupones}</div>
                  )}
                </div>

                <div className="col-md-3">
                  <label
                    className="form-label fw-semibold"
                    htmlFor="fecha-creacion-promocion"
                  >
                    Fecha de creación
                  </label>
                  <input
                    id="fecha-creacion-promocion"
                    type="date"
                    className={`form-control ${
                      errores.fecha_creacion ? "is-invalid" : ""
                    }`}
                    value={formulario.fecha_creacion}
                    onChange={(e) =>
                      actualizarCampo("fecha_creacion", e.target.value)
                    }
                  />
                  {errores.fecha_creacion && (
                    <div className="invalid-feedback">
                      {errores.fecha_creacion}
                    </div>
                  )}
                </div>

                <div className="col-md-3">
                  <label
                    className="form-label fw-semibold"
                    htmlFor="estado-promocion"
                  >
                    Estado
                  </label>
                  <select
                    id="estado-promocion"
                    className="form-select"
                    value={formulario.estado}
                    onChange={(e) => actualizarCampo("estado", e.target.value)}
                  >
                    {ESTADOS_DISPONIBLES.map((estado) => (
                      <option key={estado.value} value={estado.value}>
                        {estado.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <label
                    className="form-label fw-semibold"
                    htmlFor="rating-promocion"
                  >
                    Rating
                  </label>
                  <input
                    id="rating-promocion"
                    type="number"
                    step="0.1"
                    className={`form-control ${
                      errores.rating ? "is-invalid" : ""
                    }`}
                    value={formulario.rating}
                    onChange={(e) => actualizarCampo("rating", e.target.value)}
                  />
                  {errores.rating && (
                    <div className="invalid-feedback">{errores.rating}</div>
                  )}
                </div>
              </div>

              <hr className="my-5 opacity-10" />

              <div className="row g-4">
                <div className="col-md-6">
                  <label
                    className="form-label fw-semibold"
                    htmlFor="imagen-promocion"
                  >
                    Imagen principal
                  </label>
                  <input
                    type="text"
                    id="imagen-promocion"
                    placeholder="Ingrese un url"
                    required
                    autoComplete="off"
                    onChange={(e) => actualizarCampo("img", e.target.value)}
                    value={formulario.img}
                    className="form-control"
                  />{" "}
                </div>
              </div>

              <div className="d-flex justify-content-end gap-3 mt-5">
                <button
                  type="button"
                  className="btn btn-link text-decoration-none text-secondary"
                  onClick={() => navigate(-1)}
                  disabled={enProceso}
                >
                  Cancelar y volver
                </button>
                <button
                  type="submit"
                  className="btn btn-accent px-5"
                  disabled={enProceso}
                >
                  {enProceso ? (
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : null}
                  {enProceso ? "Guardando..." : "Publicar promoción"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {mostrarModalExito && (
        <>
          <div className="modal fade show d-block" role="dialog" aria-modal="true" tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content bg-panel border-light-subtle shadow-lg">
                <div className="modal-header border-0 pt-4 pb-0 ps-4 pe-5">
                  <h5 className="modal-title fw-bold">Éxito</h5>
                </div>
                <div className="modal-body ps-4 pe-5">
                  <p>La promoción ha sido creada exitosamente.</p>
                </div>
                <div className="modal-footer border-0 pt-0 pb-4 ps-4 pe-5">
                  <button
                    type="button"
                    className="btn btn-accent"
                    onClick={() => {
                      setMostrarModalExito(false);
                      navigate(-1);
                    }}
                  >
                    Aceptar
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" />
        </>
      )}
    </div>
  );
};

export default CrearPromocionPagina;
