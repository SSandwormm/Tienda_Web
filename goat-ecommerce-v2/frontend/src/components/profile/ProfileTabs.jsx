import React from "react";

export const PROFILE_TABS = [
  { id: "datos", label: "DATOS PERSONALES" },
  { id: "direcciones", label: "DIRECCIONES" },
  { id: "pagos", label: "MÉTODOS DE PAGO" },
  { id: "pedidos", label: "MIS PEDIDOS" },
];

export default function ProfileTabs({
  activeTab,
  onChange,
  counts = {},
  profileIncomplete = false,
}) {
  const handleKeyDown = (event, index) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      onChange(PROFILE_TABS[(index + 1) % PROFILE_TABS.length].id);
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      onChange(
        PROFILE_TABS[(index - 1 + PROFILE_TABS.length) % PROFILE_TABS.length]
          .id,
      );
    }
  };

  return (
    <div
      className="profile-tabs"
      role="tablist"
      aria-label="Secciones del perfil"
    >
      {PROFILE_TABS.map((tab, index) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          id={`profile-tab-${tab.id}`}
          aria-selected={activeTab === tab.id}
          aria-controls={`profile-panel-${tab.id}`}
          tabIndex={activeTab === tab.id ? 0 : -1}
          className={`profile-tab ${activeTab === tab.id ? "active" : ""}`}
          onClick={() => onChange(tab.id)}
          onKeyDown={(event) => handleKeyDown(event, index)}
        >
          <span>{tab.label}</span>
          {counts[tab.id] !== undefined && (
            <span className="profile-tab-count">
              {counts[tab.id] === null ? "—" : counts[tab.id]}
            </span>
          )}
          {tab.id === "datos" && profileIncomplete && (
            <span
              className="profile-tab-status"
              title="Tu perfil necesita algunos datos"
              aria-label="Tu perfil necesita algunos datos"
            />
          )}
        </button>
      ))}
    </div>
  );
}
