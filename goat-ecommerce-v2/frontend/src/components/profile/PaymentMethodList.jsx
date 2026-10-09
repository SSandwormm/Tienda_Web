import React, { useEffect, useRef, useState } from "react";
import FlipButton from "../ui/FlipButton.jsx";
import PaymentMethodForm from "./PaymentMethodForm.jsx";

export default function PaymentMethodList({
  methods,
  loading,
  onDelete,
  onDefault,
  error,
  onRetry,
}) {
  const [adding, setAdding] = useState(false);
  const triggerRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!adding) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") setAdding(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus();
    };
  }, [adding]);
  if (loading)
    return (
      <section className="profile-section profile-card">
        <p className="profile-muted">Cargando métodos de pago...</p>
      </section>
    );
  return (
    <section className="profile-section profile-card">
      <div className="profile-section-header">
        <h2>MÉTODOS DE PAGO</h2>
        <FlipButton
          ref={triggerRef}
          variant="gold"
          size="small"
          front="AÑADIR TARJETA"
          back="PRÓXIMAMENTE"
          onClick={(event) => {
            triggerRef.current = event.currentTarget;
            setAdding(true);
          }}
        />
      </div>
      {error && (
        <div className="profile-section-error" role="alert">
          <span>No se pudieron cargar tus métodos de pago.</span>
          <button type="button" onClick={onRetry}>
            Reintentar
          </button>
        </div>
      )}
      <div className="profile-list">
        {methods.length
          ? methods.map((method) => (
              <article className="profile-list-item" key={method.id}>
                <div>
                  <strong>
                    {method.brand || "Tarjeta"} · •••• {method.last4}
                  </strong>
                  <p>
                    Vence {String(method.exp_month).padStart(2, "0")}/
                    {method.exp_year} · {method.holder_name}
                  </p>
                </div>
                <div className="profile-item-actions">
                  {!method.is_default && (
                    <button
                      type="button"
                      className="profile-link-button"
                      onClick={() => onDefault(method.id)}
                    >
                      PRINCIPAL
                    </button>
                  )}
                  <button
                    type="button"
                    className="profile-link-button danger"
                    onClick={() => onDelete(method)}
                  >
                    ELIMINAR
                  </button>
                </div>
              </article>
            ))
          : !adding && (
              <p className="profile-muted">
                No tienes métodos de pago guardados.
              </p>
            )}
      </div>
      {adding && (
        <div
          className="profile-modal-backdrop"
          role="presentation"
          onMouseDown={(event) =>
            event.target === event.currentTarget && setAdding(false)
          }
        >
          <div
            className="profile-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-dialog-title"
            tabIndex={-1}
            ref={dialogRef}
          >
            <div className="profile-modal-header">
              <h2 id="payment-dialog-title">Añadir método de pago</h2>
              <button
                type="button"
                className="profile-modal-close"
                onClick={() => setAdding(false)}
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>
            <PaymentMethodForm onCancel={() => setAdding(false)} />
          </div>
        </div>
      )}
    </section>
  );
}
