import React from "react";
import { Link } from "react-router-dom";
import FlipButton from "../ui/FlipButton.jsx";

export default function ProfileHeader({
  user,
  isAdmin,
  initials,
  memberSince,
  displayName,
  onLogout,
}) {
  return (
    <aside className="profile-sidebar">
      <div className="profile-avatar">{initials}</div>
      <h2 className="profile-account-name">{displayName}</h2>
      <p className="profile-email">{user?.email}</p>
      <span className={`profile-role-badge ${isAdmin ? "admin" : "user"}`}>
        {isAdmin ? "ADMINISTRADOR" : "CLIENTE"}
      </span>
      <p className="profile-since">MIEMBRO DESDE {memberSince.toUpperCase()}</p>
      {isAdmin && (
        <Link
          to="/admin/dashboard"
          className="profile-admin-link profile-header-admin-link"
        >
          PANEL ADMIN →
        </Link>
      )}
      <FlipButton
        variant="outline"
        front="CERRAR SESIÓN"
        back="SALIR →"
        onClick={onLogout}
      />
    </aside>
  );
}
