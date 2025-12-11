// inside /src/components/sellerdashboard/index.jsx
import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";
import { sellerRoutes } from "./routes/sellerRoutes";

const renderRoute = (route) => {
  if (route.children && route.children.length) {
    return (
      <Route key={route.path} path={route.path} element={route.element ?? <Outlet />}>
        {route.children.map((child) => (
          <Route
            key={route.path + "/" + (child.path || "index")}
            index={child.path === ""} // set index if path === ''
            path={child.path === "" ? undefined : child.path}
            element={child.element}
          />
        ))}
      </Route>
    );
  }

  return <Route key={route.path} path={route.path} element={route.element} />;
};

const SellerDashboard = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        {sellerRoutes.map(renderRoute)}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default SellerDashboard;
