import React, { useEffect, useState } from "react";
import FlipButton from "../ui/FlipButton.jsx";

const PHONE_PATTERN = /^[+\d][\d\s()-]{6,20}$/;

export default function PersonalDataCard({
  profile,
  user,
  onSave,
  saving,
  error,
  success,
  profileCompletion = 0,
}) {
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    setFullName(profile?.full_name || "");
    setPhone(profile?.phone || "");
    setDocumentType(profile?.document_type || "");
    setDocumentNumber(profile?.document_number || "");
  }, [profile]);

  const submit = async (event) => {
    event.preventDefault();
    if (phone && !PHONE_PATTERN.test(phone)) {
      setValidationError("Escribe un teléfono válido.");
      return;
    }
    setValidationError("");
    await onSave({
      full_name: fullName.trim(),
      phone: phone.trim(),
      document_type: documentType,
      document_number: documentNumber.trim(),
    });
    setEditing(false);
  };

  return (
    <section className="profile-section profile-card">
      <div className="profile-section-header">
        <h2>DATOS PERSONALES</h2>
        {!editing && (
          <FlipButton
            variant="outline"
            size="small"
            front="EDITAR"
            back="EDITAR →"
            onClick={() => setEditing(true)}
          />
        )}
      </div>
      {editing ? (
        <form className="profile-form" onSubmit={submit}>
          <div className="profile-form-grid">
            <label className="profile-field">
              <span>CORREO ELECTRÓNICO</span>
              <input
                className="profile-input"
                value={user?.email || ""}
                readOnly
              />
            </label>
            <label className="profile-field">
              <span>NOMBRE COMPLETO</span>
              <input
                className="profile-input"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                autoComplete="name"
              />
            </label>
            <label className="profile-field">
              <span>TELÉFONO</span>
              <input
                className="profile-input"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                autoComplete="tel"
              />
            </label>
            <label className="profile-field">
              <span>TIPO DE DOCUMENTO</span>
              <select
                className="profile-input"
                value={documentType}
                onChange={(event) => setDocumentType(event.target.value)}
              >
                <option value="">Seleccionar</option>
                <option value="CC">Cédula</option>
                <option value="CE">Cédula de extranjería</option>
                <option value="PASSPORT">Pasaporte</option>
              </select>
            </label>
            <label className="profile-field">
              <span>NÚMERO DE DOCUMENTO</span>
              <input
                className="profile-input"
                value={documentNumber}
                onChange={(event) => setDocumentNumber(event.target.value)}
              />
            </label>
          </div>
          {(validationError || error) && (
            <p className="profile-error">{validationError || error}</p>
          )}
          {success && <p className="profile-success">{success}</p>}
          <div className="profile-form-actions">
            <FlipButton
              type="submit"
              disabled={saving}
              front={saving ? "GUARDANDO..." : "GUARDAR CAMBIOS"}
              back="GUARDADO ✓"
            />
            <FlipButton
              variant="outline"
              front="CANCELAR"
              back="CANCELAR"
              onClick={() => {
                setEditing(false);
                setValidationError("");
              }}
            />
          </div>
        </form>
      ) : (
        <div className="profile-form-grid profile-readonly-grid">
          <div className="profile-field">
            <span>CORREO ELECTRÓNICO</span>
            <p className="profile-field-value readonly">{user?.email || "—"}</p>
          </div>
          <div className="profile-field">
            <span>NOMBRE COMPLETO</span>
            <p className="profile-field-value">{profile?.full_name || "—"}</p>
          </div>
          <div className="profile-field">
            <span>TELÉFONO</span>
            <p className="profile-field-value">{profile?.phone || "—"}</p>
          </div>
          <div className="profile-field">
            <span>DOCUMENTO</span>
            <p className="profile-field-value">
              {profile?.document_type && profile?.document_number
                ? `${profile.document_type} ${profile.document_number}`
                : "—"}
            </p>
          </div>
        </div>
      )}
      <div
        className="profile-completion"
        aria-label={`Perfil completado al ${profileCompletion}%`}
      >
        <div className="profile-completion-heading">
          <span>PERFIL COMPLETADO</span>
          <strong>{profileCompletion}%</strong>
        </div>
        <div className="profile-completion-track">
          <span style={{ width: `${profileCompletion}%` }} />
        </div>
        {!editing && profileCompletion < 100 && (
          <button
            type="button"
            className="profile-completion-button"
            onClick={() => setEditing(true)}
          >
            Completar perfil
          </button>
        )}
      </div>
    </section>
  );
}
