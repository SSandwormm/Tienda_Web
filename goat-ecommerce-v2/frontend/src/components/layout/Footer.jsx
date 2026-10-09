// =========================================
// IMPORTACIÓN DE REACT
// =========================================

// React permite crear componentes reutilizables.
import React from "react";
import { useLocation } from "react-router-dom";

// =========================================
// COMPONENTE FOOTER
// =========================================
//
// Este componente representa el pie de página
// de la tienda.
//
// Se divide en dos partes:
//
// 1. Footer principal
//      - Suscripción
//      - Políticas
//      - Información
//      - Redes sociales
//
// 2. Sub Footer
//      - Nombre de la marca
//      - Copyright
//

export default function Footer() {
  const { pathname } = useLocation();
  const isFuturePage = pathname === "/prendas-futuras";
  const footerTheme = isFuturePage ? " footer--dark" : "";

  return (
    <>
      {/* =====================================
          FOOTER PRINCIPAL
      ====================================== */}

      <footer className={`site-footer${footerTheme}`}>
        {/* =====================================
            LADO IZQUIERDO
        ======================================

            Contiene:

            - Título de suscripción
            - Descuento
            - Formulario
            - Política de privacidad

        */}

        <div className="footer-left">
          {/* Título principal */}

          <h3>SUSCRIBETE Y OBTEN UN 10% DE DESCUENTO</h3>

          {/* Texto secundario */}

          <p className="subtitle">*no es acumulable con otras promociones</p>

          {/* =====================================
              FORMULARIO DE SUSCRIPCIÓN
          ======================================

              El usuario escribe su correo
              para suscribirse.

              Actualmente solo es la interfaz.
              Más adelante se puede conectar
              con el Backend.
          */}

          <form className="subscribe-form">
            {/* Grupo que contiene
                input + botón */}

            <div className="input-group">
              {/* Campo para escribir el correo */}

              <input type="email" placeholder="CORREO ELECTRONICO" required />

              {/* Botón para enviar el formulario */}

              <button type="submit">
                {/* Icono de flecha hecho con SVG */}

                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>

            {/* =====================================
                POLÍTICA DE PRIVACIDAD
            ======================================

                Antes de enviar el formulario
                el usuario debe aceptar
                la política de privacidad.
            */}

            <label className="privacy-check">
              <input type="checkbox" required />

              <span>He leído y acepto la Política de Privacidad</span>
            </label>
          </form>
        </div>

        {/* =====================================
            LADO DERECHO
        ======================================

            Aquí se muestran las diferentes
            columnas de enlaces del Footer.

        */}

        <div className="footer-right">
          {/* =====================================
              COLUMNA DE POLÍTICAS
          ====================================== */}

          <div className="footer-col">
            <h4>POLÍTICAS</h4>

            <a href="#">ENVÍOS</a>

            <a href="#">CAMBIOS Y DEVOLUCIONES</a>

            <a href="#">CANAL LEGAL</a>

            <a href="#">POLÍTICAS DE PRIVACIDAD</a>
          </div>

          {/* =====================================
              COLUMNA GENERAL
          ====================================== */}

          <div className="footer-col">
            <h4>GENERAL</h4>

            <a href="#">CENTRO DE AYUDA</a>

            <a href="#">COOKIES</a>

            <a href="#">CONTACTO</a>
          </div>

          {/* =====================================
              REDES SOCIALES
          ====================================== */}

          <div className="footer-col">
            <h4>REDES SOCIALES</h4>

            <a href="#">INSTAGRAM</a>

            <a href="#">YOUTUBE</a>

            <a href="#">TIKTOK</a>

            <a href="#">WHATSAPP</a>
          </div>
        </div>
      </footer>

      {/* =====================================
          SUB FOOTER
      ======================================

          Parte inferior del Footer.

          Generalmente contiene:

          - Nombre de la empresa
          - Derechos de autor
          - Año actual

      */}

      <div className={`sub-footer${footerTheme}`}>
        {/* Logo o nombre de la marca */}

        <div className="sub-footer-logo">GOATSTUDIOS</div>

        {/* Copyright */}

        <div className="sub-footer-copy">
          © 2026 GOATSTUDIOS · TODOS LOS DERECHOS RESERVADOS
        </div>
      </div>
    </>
  );
}
