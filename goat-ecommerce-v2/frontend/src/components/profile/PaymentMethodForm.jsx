import React from "react";
import FlipButton from "../ui/FlipButton.jsx";

export default function PaymentMethodForm({ onCancel }) {
  return (
    <div className="profile-payment-placeholder">
      <p>Los pagos se activarán próximamente.</p>
      <p>
        Primero debemos conectar una pasarela como Wompi, Mercado Pago, PayU o
        Stripe. El número de tarjeta y el CVV se capturarán únicamente mediante
        sus campos seguros.
      </p>
      <FlipButton
        variant="outline"
        front="CERRAR"
        back="CERRAR"
        onClick={onCancel}
      />
    </div>
  );
}
