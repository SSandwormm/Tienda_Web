import React from "react";
import { Link } from "react-router-dom";

export default function SectionHeader({ title, to, description }) {
  return (
    <div className="section-panel section-panel-with-action">
      <div className="section-heading">
        <div>
          <h2 className="section-title">{title}</h2>
          {description && <p className="section-copy">{description}</p>}
        </div>
      </div>
      <Link to={to} className="section-link">
        Ver todo
      </Link>
    </div>
  );
}
