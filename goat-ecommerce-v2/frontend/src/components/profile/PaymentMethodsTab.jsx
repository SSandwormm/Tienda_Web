import React, { useEffect, useState } from "react";
import {
  deletePaymentMethod,
  listPaymentMethods,
  setDefaultPaymentMethod,
} from "../../services/paymentMethodService.js";
import PaymentMethodList from "./PaymentMethodList.jsx";

export default function PaymentMethodsTab({ userId, onMessage }) {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    if (!userId) return;
    setLoading(true);
    setError("");
    try {
      setMethods(await listPaymentMethods(userId));
      setLoaded(true);
    } catch (loadError) {
      setError(
        loadError.message || "No se pudieron cargar tus métodos de pago.",
      );
      setLoaded(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loaded) load();
  }, [loaded, userId]);

  const handleDelete = async (method) => {
    if (!window.confirm(`¿Eliminar la tarjeta terminada en ${method.last4}?`))
      return;
    await deletePaymentMethod(method.id, userId);
    setMethods((current) => current.filter((item) => item.id !== method.id));
    onMessage("Método de pago eliminado.");
  };

  const handleDefault = async (id) => {
    await setDefaultPaymentMethod(id, userId);
    setMethods((current) =>
      current.map((item) => ({ ...item, is_default: item.id === id })),
    );
    onMessage("Método de pago principal actualizado.");
  };

  return (
    <div
      id="profile-panel-pagos"
      role="tabpanel"
      aria-labelledby="profile-tab-pagos"
      className="profile-tab-content"
    >
      <PaymentMethodList
        methods={methods}
        loading={loading}
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
