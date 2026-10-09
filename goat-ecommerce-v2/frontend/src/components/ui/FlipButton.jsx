import React from "react";
import "../../styles/flip-button.css";

export function FlipButtonFront({ children }) {
  return <span className="flip-button-face flip-button-front">{children}</span>;
}

export function FlipButtonBack({ children }) {
  return <span className="flip-button-face flip-button-back">{children}</span>;
}

export default function FlipButton({
  children,
  front,
  back,
  variant = "default",
  size = "default",
  type = "button",
  onClick,
  disabled = false,
  className = "",
}) {
  return (
    <button
      type={type}
      className={`flip-button flip-button-${variant} flip-button-${size} ${className}`.trim()}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="flip-button-inner">
        <FlipButtonFront>{front ?? children}</FlipButtonFront>
        <FlipButtonBack>{back ?? front ?? children}</FlipButtonBack>
      </span>
    </button>
  );
}
