import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/global.css";
import "./styles/home.css";
import "./styles/header.css";
import "./styles/footer.css";
import "./styles/cartdrawer.css";
import "./styles/login.css";
import "./styles/prendasfuturas.css";
import "./styles/sobrenosotros.css";
import "./styles/products.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
