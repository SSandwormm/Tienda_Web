import React from "react";
import { Navigate } from "react-router-dom";

export default function Redirect({ to }) {
  return <Navigate to={to} replace />;
}
