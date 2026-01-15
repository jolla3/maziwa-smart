// /src/components/Sellers/SellerDashboard.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";

const SellerDashboard = () => {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default SellerDashboard;
