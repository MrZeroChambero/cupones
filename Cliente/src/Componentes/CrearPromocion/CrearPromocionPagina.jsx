import { useEffect, useState } from "react";
import { FiImage, FiUpload, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom"; // Importante para la navegación

const ESTADOS_DISPONIBLES = [
  { value: "disponible", label: "Disponible" },
  { value: "agotándose", label: "Agotándose" },
  { value: "nuevo", label: "Nuevo" },
];

const TIPOS_IMAGEN = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
const TIPOS_ICONO = ["image/jpeg", "image/jpg", "image/png", "image/svg+xml", "image/x-icon", "image/vnd.microsoft.icon"];
const TIPOS_IMAGEN_TEXTO = "JPG, PNG, WEBP o GIF";
const TIPOS_ICONO_TEXTO = "JPG, PNG, SVG o ICO";

const inicialFormulario = {
  marca: "",
  nombre: "",
  detalles: "",
  cupones: "1",
  estado: ESTADOS_DISPONIBLES[0].value,
  rating: "4.5",
};

const CrearPromocionPagina = ({ enProceso = false, onGuardar }) => {
  const navigate = useNavigate();
  const [formulario, setFormulario] = useState(inicialFormulario);
  const [archivos, setArchivos] = useState({ imagen: null, icono: null });
  const [errores, setErrores] = useState({});
  const [mensajeGeneral, setMensajeGeneral] = useState("");

  const actualizarCampo = (campo, valor) => {
    setFormulario((prev) => ({ ...prev, [campo]: valor }));
  };

  const actualizarArchivo = (campo, archivosEntrada) => {
    const archivo = archivosEntrada?.[0] ?? null;
    setArchivos((prev) => ({ ...prev, [campo]: archivo }));
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

    if (!archivos.imagen) {
      nuevosErrores.imagen = "Selecciona una imagen principal.";
    } else if (!TIPOS_IMAGEN.includes(archivos.imagen.type)) {
      nuevosErrores.imagen = "Formato de imagen no permitido.";
    }

    if (!archivos.icono) {
      nuevosErrores.icono = "Selecciona un icono.";
    } else if (!TIPOS_ICONO.includes(archivos.icono.type)) {
      nuevosErrores.icono = "Formato de icono no permitido.";
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
    payload.append("imagen", archivos.imagen);
    payload.append("icono", archivos.icono);

    try {
      await onGuardar?.(payload);
      // Opcional: navegar a la lista después de guardar con éxito
      // navigate("/promociones");
    } catch (error) {
      const mensaje = error?.message ?? "No se pudo guardar la promoción.";
      setMensajeGeneral(mensaje);
    }
  };

  const renderInputArchivo = (campo, etiqueta, tiposLegibles, descripcion) => {
    const archivoSeleccionado = archivos[campo];
    return (
      <div className="mb-3">
        <label className="form-label fw-semibold">{etiqueta}</label>
        <div className={`upload-dropzone ${errores[campo] ? "is-invalid" : ""}`}>
          <FiImage aria-hidden="true" />
          <div>
            <p className="mb-0 fw-semibold">{archivoSeleccionado ? archivoSeleccionado.name : "Selecciona un archivo"}</p>
            <p className="text-body-secondary small mb-0">{descripcion}</p>
          </div>
          <label className="btn btn-outline-accent btn-sm mb-0">
            <span className="d-inline-flex align-items-center gap-2">
              <FiUpload aria-hidden="true" /> Subir
            </span>
            <input type="file" accept={tiposLegibles} className="d-none" onChange={(e) => actualizarArchivo(campo, e.target.files)} />
          </label>
        </div>
        {errores[campo] && <div className="invalid-feedback d-block">{errores[campo]}</div>}
      </div>
    );
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          {/* Cabecera de la página */}
          <div className="d-flex align-items-center gap-3 mb-4">
            <button type="button" className="btn btn-outline-secondary btn-sm rounded-circle" onClick={() => navigate(-1)} title="Volver">
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
                  <label className="form-label fw-semibold" htmlFor="marca-promocion">
                    Marca
                  </label>
                  <input
                    id="marca-promocion"
                    type="text"
                    className={`form-control ${errores.marca ? "is-invalid" : ""}`}
                    value={formulario.marca}
                    onChange={(e) => actualizarCampo("marca", e.target.value)}
                    placeholder="Ej. ShopiTech"
                  />
                  {errores.marca && <div className="invalid-feedback">{errores.marca}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold" htmlFor="nombre-promocion">
                    Nombre comercial
                  </label>
                  <input
                    id="nombre-promocion"
                    type="text"
                    className={`form-control ${errores.nombre ? "is-invalid" : ""}`}
                    value={formulario.nombre}
                    onChange={(e) => actualizarCampo("nombre", e.target.value)}
                    placeholder="Ej. Semana Gamer"
                  />
                  {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold" htmlFor="detalles-promocion">
                    Detalles
                  </label>
                  <textarea
                    id="detalles-promocion"
                    className={`form-control ${errores.detalles ? "is-invalid" : ""}`}
                    rows={4}
                    value={formulario.detalles}
                    onChange={(e) => actualizarCampo("detalles", e.target.value)}
                    placeholder="Describe los beneficios principales de la promoción..."
                  />
                  {errores.detalles && <div className="invalid-feedback">{errores.detalles}</div>}
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold" htmlFor="cupones-promocion">
                    Cupones activos
                  </label>
                  <input
                    id="cupones-promocion"
                    type="number"
                    className={`form-control ${errores.cupones ? "is-invalid" : ""}`}
                    value={formulario.cupones}
                    onChange={(e) => actualizarCampo("cupones", e.target.value)}
                  />
                  {errores.cupones && <div className="invalid-feedback">{errores.cupones}</div>}
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold" htmlFor="estado-promocion">
                    Estado
                  </label>
                  <select id="estado-promocion" className="form-select" value={formulario.estado} onChange={(e) => actualizarCampo("estado", e.target.value)}>
                    {ESTADOS_DISPONIBLES.map((estado) => (
                      <option key={estado.value} value={estado.value}>
                        {estado.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold" htmlFor="rating-promocion">
                    Rating
                  </label>
                  <input
                    id="rating-promocion"
                    type="number"
                    step="0.1"
                    className={`form-control ${errores.rating ? "is-invalid" : ""}`}
                    value={formulario.rating}
                    onChange={(e) => actualizarCampo("rating", e.target.value)}
                  />
                  {errores.rating && <div className="invalid-feedback">{errores.rating}</div>}
                </div>
              </div>

              <hr className="my-5 opacity-10" />

              <div className="row g-4">
                <div className="col-md-6">{renderInputArchivo("imagen", "Imagen principal", TIPOS_IMAGEN.join(","), TIPOS_IMAGEN_TEXTO)}</div>
                <div className="col-md-6">{renderInputArchivo("icono", "Icono de marca", TIPOS_ICONO.join(","), TIPOS_ICONO_TEXTO)}</div>
              </div>

              <div className="d-flex justify-content-end gap-3 mt-5">
                <button type="button" className="btn btn-link text-decoration-none text-secondary" onClick={() => navigate(-1)} disabled={enProceso}>
                  Cancelar y volver
                </button>
                <button type="submit" className="btn btn-accent px-5" disabled={enProceso}>
                  {enProceso ? <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> : null}
                  {enProceso ? "Guardando..." : "Publicar promoción"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrearPromocionPagina;
