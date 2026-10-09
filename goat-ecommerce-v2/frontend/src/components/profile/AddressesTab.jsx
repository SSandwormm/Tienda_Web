import React, { useEffect, useState } from "react";
import {
  createAddress,
  deleteAddress,
  listAddresses,
  setDefaultAddress,
  updateAddress,
} from "../../services/addressService.js";
import AddressList from "./AddressList.jsx";

export default function AddressesTab({ userId, onMessage }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    if (!userId) return;
    setLoading(true);
    setError("");
    try {
      setAddresses(await listAddresses(userId));
      setLoaded(true);
    } catch (loadError) {
      setError(loadError.message || "No se pudieron cargar tus direcciones.");
      setLoaded(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loaded) load();
  }, [loaded, userId]);

  const refresh = async (message) => {
    await load();
    if (message) onMessage(message);
  };

  const handleCreate = async (value) => {
    if (addresses.length >= 5)
      throw new Error("Puedes guardar máximo 5 direcciones.");
    const created = await createAddress(userId, value);
    setAddresses((current) =>
      value.is_default
        ? [created, ...current.map((item) => ({ ...item, is_default: false }))]
        : [created, ...current],
    );
    onMessage("Dirección guardada correctamente.");
  };

  const handleUpdate = async (id, value) => {
    const updated = await updateAddress(id, userId, value);
    setAddresses((current) =>
      current.map((item) =>
        item.id === id
          ? updated
          : value.is_default
            ? { ...item, is_default: false }
            : item,
      ),
    );
    onMessage("Dirección actualizada correctamente.");
  };

  const handleDelete = async (address) => {
    if (!window.confirm(`¿Eliminar la dirección ${address.label}?`)) return;
    await deleteAddress(address.id, userId);
    await refresh("Dirección eliminada correctamente.");
  };

  const handleDefault = async (id) => {
    await setDefaultAddress(id, userId);
    setAddresses((current) =>
      current.map((item) => ({ ...item, is_default: item.id === id })),
    );
    onMessage("Dirección principal actualizada.");
  };

  return (
    <div
      id="profile-panel-direcciones"
      role="tabpanel"
      aria-labelledby="profile-tab-direcciones"
      className="profile-tab-content"
    >
      <AddressList
        addresses={addresses}
        loading={loading}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onDefault={handleDefault}
        error={error}
        onRetry={() => {
          setLoaded(false);
          load();
        }}
      />
    </div>
  );
}
