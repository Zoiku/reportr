import React from "react";
import { Outlet } from "react-router-dom";

export default function SystemLayout() {
  return (
    <div className="h-screen grid place-content-center">
      <Outlet />
    </div>
  );
}
