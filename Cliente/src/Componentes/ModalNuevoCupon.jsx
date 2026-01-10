import { useEffect, useMemo, useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";

const inicialFormulario = {
  marca: "",
  descripcion: "",
  codigo: "",
  categoriaId: "",
  expira: "",
  descuento: "",
  enlace: "",
  logoArchivo: null,
};

const ModalNuevoCupon = ({
  visible,
  categorias = [],
  enProceso = false,
  onCerrar,
  onGuardar,
}) => {
  const [formulario, setFormulario] = useState(inicialFormulario);
  const [errores, setErrores] = useState({});
  const [versionArchivo, setVersionArchivo] = useState(0);

  const categoriaInicial = useMemo(
    () => categorias[0]?.id?.toString() ?? "",
    [categorias]
  );

  useEffect(() => {
    if (!visible) {
      document.body.classList.remove("modal-open");
      document.body.style.paddingRight = "";
      return;
    }
    document.body.classList.add("modal-open");
    document.body.style.paddingRight = "0px";
    setFormulario((prev) => ({
      ...inicialFormulario,
      categoriaId: categoriaInicial,
    }));
    setVersionArchivo((prev) => prev + 1);
    setErrores({});

    return () => {
      document.body.classList.remove("modal-open");
      document.body.style.paddingRight = "";
    };
  }, [visible, categoriaInicial]);

  if (!visible) {
    return null;
  }

  const actualizarCampo = (campo, valor) => {
    setFormulario((prev) => ({ ...prev, [campo]: valor }));
  };

  const validar = () => {
    const nuevosErrores = {};
    if (!formulario.marca.trim()) {
      nuevosErrores.marca = "La marca es obligatoria.";
    }
    if (!formulario.descripcion.trim() || formulario.descripcion.length < 10) {
      nuevosErrores.descripcion =
        "Describe el beneficio (mínimo 10 caracteres).";
    }
    if (!formulario.codigo.trim()) {
      nuevosErrores.codigo = "El código es obligatorio.";
    }
    if (!formulario.categoriaId) {
      nuevosErrores.categoria_id = "Selecciona una categoría.";
    }
    if (!formulario.expira) {
      nuevosErrores.expira = "Define la fecha de expiración.";
    }
    if (!formulario.descuento.trim()) {
      nuevosErrores.descuento = "Especifica el descuento.";
    }
    if (!formulario.enlace.trim()) {
      nuevosErrores.enlace = "Necesitas una URL de la tienda.";
    }
    return nuevosErrores;
  };

  const manejarSubmit = async (evento) => {
    evento.preventDefault();
    const nuevosErrores = validar();
    if (Object.keys(nuevosErrores).length) {
      setErrores(nuevosErrores);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("marca", formulario.marca.trim());
      formData.append("descripcion", formulario.descripcion.trim());
      formData.append("codigo", formulario.codigo.trim().toUpperCase());
      formData.append("categoria_id", String(formulario.categoriaId));
      formData.append("expira", formulario.expira);
      formData.append("descuento", formulario.descuento.trim());
      formData.append("enlace", formulario.enlace.trim());
      if (formulario.logoArchivo instanceof File) {
        formData.append("logo", formulario.logoArchivo);
      }
      await onGuardar(formData);
      setFormulario({ ...inicialFormulario, categoriaId: categoriaInicial });
      setVersionArchivo((prev) => prev + 1);
      setErrores({});
    } catch (error) {
      if (error?.detalle && typeof error.detalle === "object") {
        setErrores(error.detalle);
      } else if (error?.message) {
        setErrores({ general: error.message });
      }
    }
  };

  const mensajeError = (campo) => {
    if (!errores[campo]) return null;
    return <p className="text-danger small mb-0 mt-1">{errores[campo]}</p>;
  };

  return (
    <>
      <div className="modal fade show d-block" role="dialog" aria-modal="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content bg-panel border-light-subtle shadow-lg position-relative">
            <button
              type="button"
              className="modal-close-circle"
              aria-label="Cerrar"
              onClick={onCerrar}
            >
              <FiX size={18} />
            </button>
            <div className="modal-header border-0 pt-4 pb-0 ps-4 pe-5">
              <div>
                <p className="text-body-secondary small mb-1">
                  Nuevo registro manual
                </p>
                <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                  <FiPlus aria-hidden="true" /> Registrar cupón
                </h5>
              </div>
            </div>
            <form className="modal-body ps-4 pe-5" onSubmit={manejarSubmit}>
              {errores.general && (
                <div className="alert alert-danger" role="alert">
                  {errores.general}
                </div>
              )}
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Marca *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formulario.marca}
                    onChange={(e) => actualizarCampo("marca", e.target.value)}
                    disabled={enProceso}
                  />
                  {mensajeError("marca")}
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Código *</label>
                  <input
                    type="text"
                    className="form-control text-uppercase"
                    value={formulario.codigo}
                    onChange={(e) => actualizarCampo("codigo", e.target.value)}
                    disabled={enProceso}
                  />
                  {mensajeError("codigo")}
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold">
                    Descripción *
                  </label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={formulario.descripcion}
                    onChange={(e) =>
                      actualizarCampo("descripcion", e.target.value)
                    }
                    disabled={enProceso}
                  />
                  {mensajeError("descripcion")}
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Categoría *</label>
                  <select
                    className="form-select"
                    value={formulario.categoriaId}
                    onChange={(e) =>
                      actualizarCampo("categoriaId", e.target.value)
                    }
                    disabled={enProceso || !categorias.length}
                  >
                    <option value="">Selecciona una categoría</option>
                    {categorias.map((categoria) => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.nombre}
                      </option>
                    ))}
                  </select>
                  {mensajeError("categoria_id")}
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Expira *</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formulario.expira}
                    onChange={(e) => actualizarCampo("expira", e.target.value)}
                    disabled={enProceso}
                  />
                  {mensajeError("expira")}
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Descuento *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formulario.descuento}
                    onChange={(e) =>
                      actualizarCampo("descuento", e.target.value)
                    }
                    disabled={enProceso}
                  />
                  {mensajeError("descuento")}
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    URL oficial *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="tienda.ejemplo.com/oferta"
                    value={formulario.enlace}
                    onChange={(e) => actualizarCampo("enlace", e.target.value)}
                    disabled={enProceso}
                  />
                  {mensajeError("enlace")}
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Logo (imagen opcional)
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                    key={`logo-archivo-${versionArchivo}`}
                    onChange={(e) =>
                      actualizarCampo(
                        "logoArchivo",
                        e.target.files && e.target.files[0]
                          ? e.target.files[0]
                          : null
                      )
                    }
                    disabled={enProceso}
                  />
                  <small className="text-body-secondary d-block mt-1">
                    PNG, JPG, WEBP, GIF o SVG. Máx. 2 MB.
                  </small>
                  {formulario.logoArchivo && (
                    <p className="text-success small mb-0 mt-1">
                      Seleccionado: {formulario.logoArchivo.name}
                    </p>
                  )}
                  {formulario.logoArchivo && (
                    <button
                      type="button"
                      className="btn btn-link btn-sm ps-0"
                      onClick={() => {
                        actualizarCampo("logoArchivo", null);
                        setVersionArchivo((prev) => prev + 1);
                      }}
                      disabled={enProceso}
                    >
                      Quitar imagen
                    </button>
                  )}
                  {mensajeError("logo")}
                </div>
              </div>
              <div className="modal-footer border-0 justify-content-between px-0">
                <button
                  type="button"
                  className="btn btn-outline-accent"
                  onClick={onCerrar}
                  disabled={enProceso}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-accent"
                  disabled={enProceso}
                >
                  {enProceso ? "Guardando..." : "Guardar cupón"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>
  );
};

export default ModalNuevoCupon;
