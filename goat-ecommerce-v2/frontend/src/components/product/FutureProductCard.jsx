import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { voteForProduct } from "../../services/productService.js";

export default function FutureProductCard({ product }) {
  const { user } = useAuth();
  const [votes, setVotes] = useState(Number(product.votes) || 0);
  const [voted, setVoted] = useState(Boolean(product.voted));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleVote = async () => {
    if (!user) {
      setError("Inicia sesión para votar.");
      return;
    }
    if (saving || voted) return;

    try {
      setSaving(true);
      setError("");
      const updated = await voteForProduct(product.id, user.id);
      setVotes(Number(updated.votes) || votes + 1);
      setVoted(true);
    } catch (voteError) {
      setError(
        voteError.message.includes("401")
          ? "Inicia sesión para votar."
          : "No se pudo registrar el voto.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <article className="future-vote-card">
      <div className="future-vote-image-wrap">
        <img
          className="future-vote-image"
          src={product.image_url || product.image || "/placeholder.svg"}
          alt={product.name}
          loading="lazy"
        />
        <span className="future-vote-tag">
          {product.tag || product.badge || "PRUEBA DE FIT"}
        </span>
      </div>
      <div className="future-vote-content">
        <span className="future-vote-drop">
          {product.drop_label || product.drop || "DROP EN DESARROLLO"}
        </span>
        <h3>{product.name}</h3>
        <p>
          {product.description || "Diseño en desarrollo para el próximo drop."}
        </p>
        <div className="future-vote-footer">
          <span className="future-vote-count">
            <span className="future-vote-dot" aria-hidden="true" />
            {votes} Votos de interés
          </span>
          <button
            type="button"
            className={`future-vote-button${voted ? " is-voted" : ""}`}
            onClick={handleVote}
            disabled={saving || voted}
          >
            {voted ? "VOTADO" : saving ? "..." : "VOTAR"}
            <span aria-hidden="true">↗</span>
          </button>
        </div>
        {error && <small className="future-vote-error">{error}</small>}
      </div>
    </article>
  );
}
