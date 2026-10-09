import React, { useState } from "react";
import FlipButton from "../ui/FlipButton.jsx";

const emptyAddress = {
  label: "Casa",
  recipient_name: "",
  phone: "",
  department: "",
  city: "",
  neighborhood: "",
  address_line: "",
  address_extra: "",
  notes: "",
  is_default: false,
};

export default function AddressForm({
  initialValue,
  onSubmit,
  onCancel,
  saving,
}) {
  const [form, setForm] = useState({ ...emptyAddress, ...initialValue });
  const [error, setError] = useState("");
  const update = (event) =>
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  const submit = async (event) => {
    event.preventDefault();
    const required = [
      "recipient_name",
      "phone",
      "department",
      "city",
      "neighborhood",
      "address_line",
    ];
    if (required.some((field) => !String(form[field] || "").trim())) {
      setError("Completa los campos obligatorios de la dirección.");
      return;
    }
    if (!/^[+\d][\d\s()-]{6,20}$/.test(form.phone)) {
      setError("Escribe un teléfono válido.");
      return;
    }
    setError("");
    await onSubmit(form);
  };
  return (
    <form className="profile-form address-form" onSubmit={submit}>
      <div className="profile-form-grid">
        <label className="profile-field">
          <span>ETIQUETA</span>
          <select
            className="profile-input"
            name="label"
            value={form.label}
            onChange={update}
          >
            <option>Casa</option>
            <option>Trabajo</option>
            <option>Otra</option>
          </select>
        </label>
        <label className="profile-field">
          <span>QUIEN RECIBE</span>
          <input
            className="profile-input"
            name="recipient_name"
            value={form.recipient_name}
            onChange={update}
          />
        </label>
        <label className="profile-field">
          <span>TELÉFONO</span>
          <input
            className="profile-input"
            name="phone"
            value={form.phone}
            onChange={update}
            autoComplete="tel"
          />
        </label>
        <label className="profile-field">
          <span>DEPARTAMENTO</span>
          <input
            className="profile-input"
            name="department"
            value={form.department}
            onChange={update}
          />
        </label>
        <label className="profile-field">
          <span>CIUDAD</span>
          <input
            className="profile-input"
            name="city"
            value={form.city}
            onChange={update}
          />
        </label>
        <label className="profile-field">
          <span>BARRIO</span>
          <input
            className="profile-input"
            name="neighborhood"
            value={form.neighborhood}
            onChange={update}
          />
        </label>
        <label className="profile-field profile-field-wide">
          <span>DIRECCIÓN</span>
          <input
            className="profile-input"
            name="address_line"
            value={form.address_line}
            onChange={update}
          />
        </label>
        <label className="profile-field">
          <span>COMPLEMENTO</span>
          <input
            className="profile-input"
            name="address_extra"
            value={form.address_extra}
            onChange={update}
            placeholder="Apartamento, torre..."
          />
        </label>
        <label className="profile-field profile-field-wide">
          <span>INDICACIONES</span>
          <textarea
            className="profile-input profile-textarea"
            name="notes"
            value={form.notes}
            onChange={update}
          />
        </label>
      </div>
      <label className="profile-check">
        <input
          type="checkbox"
          checked={form.is_default}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              is_default: event.target.checked,
            }))
          }
        />{" "}
        Dirección principal
      </label>
      {error && <p className="profile-error">{error}</p>}
      <div className="profile-form-actions">
        <FlipButton
          type="submit"
          disabled={saving}
          front={saving ? "GUARDANDO..." : "GUARDAR"}
          back="GUARDADO ✓"
        />
        <FlipButton
          variant="outline"
          front="CANCELAR"
          back="CANCELAR"
          onClick={onCancel}
        />
      </div>
    </form>
  );
}
