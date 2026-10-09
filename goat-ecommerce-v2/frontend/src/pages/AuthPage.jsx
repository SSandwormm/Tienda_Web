import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import "../styles/login.css";

function EyeIcon({ open }) {
  if (open) {
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  }

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 3l18 18M10.5 10.7A3 3 0 0 0 12 15a3 3 0 0 0 2.3-1M7.2 7.2C5.4 8.4 3.9 10.2 3 12c0 0 3.5 7 9 7 1.7 0 3.2-.5 4.5-1.3M14.1 6.2C13.1 6 12.1 6 11 6 4.5 6 1 13 1 13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09ZM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25Z" />
    </svg>
  );
}

export default function AuthPage({ initialTab = "login" }) {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const tabFromPath = location.pathname === "/registro" ? "register" : "login";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setActiveTab(tabFromPath);
  }, [tabFromPath]);

  const switchTab = (tab) => {
    setActiveTab(tab);
    setError("");
    setSuccess("");
    navigate(tab === "login" ? "/login" : "/registro", { replace: true });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      await login(email, password);
      navigate("/tienda");
    } catch (err) {
      setError(err.message || "Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await register(email, password);

      setSuccess(
        "Cuenta creada. Revisa tu correo si se requiere confirmación.",
      );
      setTimeout(() => switchTab("login"), 2500);
    } catch (err) {
      setError(err.message || "No se pudo crear la cuenta.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = () => {
    setError("Inicio con Google o Apple estará disponible pronto.");
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <Link to="/Home" className="auth-brand">
          GOAT
        </Link>

        <div className="auth-overlay">
          <h1>DISEÑO • MOVIMIENTO • IDENTIDAD</h1>
          <p>GOATSTUDIOS, 2026 — SIEMPRE AGRADECIDO</p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-right-inner">
          <Link to="/tienda" className="auth-back">
            ← VOLVER A LA TIENDA
          </Link>

          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab ${activeTab === "login" ? "active" : ""}`}
              onClick={() => switchTab("login")}
            >
              INICIAR SESIÓN
            </button>
            <button
              type="button"
              className={`auth-tab ${activeTab === "register" ? "active" : ""}`}
              onClick={() => switchTab("register")}
            >
              CREAR CUENTA
            </button>
          </div>

          {activeTab === "login" ? (
            <form className="auth-form" onSubmit={handleLogin}>
              <h2>Bienvenido de vuelta.</h2>
              <p className="auth-subtitle">
                Ingresa tus credenciales para acceder a tu cuenta.
              </p>

              <label className="auth-field">
                <span>CORREO ELECTRÓNICO</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>

              <label className="auth-field">
                <span>CONTRASEÑA</span>
                <div className="auth-password-wrap">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="auth-eye-btn"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
              </label>

              <div className="auth-forgot">
                <button
                  type="button"
                  className="auth-link-btn"
                  onClick={() =>
                    setError(
                      "La recuperación de contraseña estará disponible pronto.",
                    )
                  }
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              {error && <div className="auth-error">{error}</div>}

              <button className="auth-submit" type="submit" disabled={loading}>
                {loading ? "INGRESANDO..." : "INGRESAR"}
              </button>

              <div className="auth-divider">
                <span>O CONTINUAR CON</span>
              </div>

              <div className="auth-social">
                <button
                  type="button"
                  className="auth-social-btn"
                  onClick={handleSocialLogin}
                >
                  <GoogleIcon />
                </button>
                <button
                  type="button"
                  className="auth-social-btn"
                  onClick={handleSocialLogin}
                >
                  <AppleIcon />
                </button>
              </div>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleRegister}>
              <h2>Crea tu cuenta.</h2>
              <p className="auth-subtitle">
                Regístrate para guardar tus pedidos y acceder a tu cuenta.
              </p>

              <label className="auth-field">
                <span>CORREO ELECTRÓNICO</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>

              <label className="auth-field">
                <span>CONTRASEÑA</span>
                <div className="auth-password-wrap">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="auth-eye-btn"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
              </label>

              <label className="auth-field">
                <span>CONFIRMAR CONTRASEÑA</span>
                <div className="auth-password-wrap">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="auth-eye-btn"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={
                      showConfirmPassword
                        ? "Ocultar contraseña"
                        : "Mostrar contraseña"
                    }
                  >
                    <EyeIcon open={showConfirmPassword} />
                  </button>
                </div>
              </label>

              {error && <div className="auth-error">{error}</div>}
              {success && <div className="auth-success">{success}</div>}

              <button className="auth-submit" type="submit" disabled={loading}>
                {loading ? "CREANDO CUENTA..." : "CREAR CUENTA"}
              </button>

              <div className="auth-divider">
                <span>O CONTINUAR CON</span>
              </div>

              <div className="auth-social">
                <button
                  type="button"
                  className="auth-social-btn"
                  onClick={handleSocialLogin}
                >
                  <GoogleIcon />
                </button>
                <button
                  type="button"
                  className="auth-social-btn"
                  onClick={handleSocialLogin}
                >
                  <AppleIcon />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
