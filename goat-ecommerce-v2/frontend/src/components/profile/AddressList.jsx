import React, { useEffect, useRef, useState } from "react";
import FlipButton from "../ui/FlipButton.jsx";
import AddressForm from "./AddressForm.jsx";

export default function AddressList({
  addresses,
  loading,
  onCreate,
  onUpdate,
  onDelete,
  onDefault,
  error,
  onRetry,
}) {
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const triggerRef = useRef(null);
  const dialogRef = useRef(null);
  const isOpen = Boolean(adding || editing);

  useEffect(() => {
    if (!isOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setAdding(false);
        setEditing(null);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus();
    };
  }, [isOpen]);

  const closeDialog = () => {
    setAdding(false);
    setEditing(null);
  };

  if (loading)
    return (
      <section className="profile-section profile-card">
        <p className="profile-muted">Cargando direcciones...</p>
      </section>
    );
  return (
    <section className="profile-section profile-card">
      <div className="profile-section-header">
        <h2>DIRECCIONES</h2>
        <FlipButton
          ref={triggerRef}
          variant="gold"
          size="small"
          front="AÑADIR DIRECCIÓN"
          back="NUEVA →"
          onClick={(event) => {
            triggerRef.current = event.currentTarget;
            setAdding(true);
            setEditing(null);
          }}
        />
      </div>
      {error && (
        <div className="profile-section-error" role="alert">
          <span>No se pudieron cargar tus direcciones.</span>
          <button type="button" onClick={onRetry}>
            Reintentar
          </button>
        </div>
      )}
      {!adding && !editing && (
        <div className="profile-list">
          {addresses.length ? (
            addresses.map((address) => (
              <article className="profile-list-item" key={address.id}>
                <div>
                  <strong>
                    {address.label}
                    {address.is_default ? " · PRINCIPAL" : ""}
                  </strong>
                  <p>
                    {address.recipient_name} · {address.phone}
                  </p>
                  <p>
                    {address.address_line}, {address.address_extra} ·{" "}
                    {address.city}, {address.department}
                  </p>
                </div>
                <div className="profile-item-actions">
                  <button
                    type="button"
                    className="profile-link-button"
                    onClick={(event) => {
                      triggerRef.current = event.currentTarget;
                      setEditing(address);
                      setAdding(false);
                    }}
                  >
                    EDITAR
                  </button>
                  {!address.is_default && (
                    <button
                      type="button"
                      className="profile-link-button"
                      onClick={() => onDefault(address.id)}
                    >
                      PRINCIPAL
                    </button>
                  )}
                  <button
                    type="button"
                    className="profile-link-button danger"
                    onClick={() => onDelete(address)}
                  >
                    ELIMINAR
                  </button>
                </div>
              </article>
            ))
          ) : (
            <p className="profile-muted">
              Aún no tienes direcciones guardadas.
            </p>
          )}
        </div>
      )}
      {isOpen && (
        <div
          className="profile-modal-backdrop"
          role="presentation"
          onMouseDown={(event) =>
            event.target === event.currentTarget && closeDialog()
          }
        >
          <div
            className="profile-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="address-dialog-title"
            tabIndex={-1}
            ref={dialogRef}
          >
            <div className="profile-modal-header">
              <h2 id="address-dialog-title">
                {editing ? "Editar dirección" : "Añadir dirección"}
              </h2>
              <button
                type="button"
                className="profile-modal-close"
                onClick={closeDialog}
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>
            <AddressForm
              initialValue={editing}
              saving={false}
              onCancel={closeDialog}
              onSubmit={async (value) => {
                if (editing) await onUpdate(editing.id, value);
                else await onCreate(value);
                closeDialog();
              }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
