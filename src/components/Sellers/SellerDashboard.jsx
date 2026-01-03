// ============================================================================
// FILE: /src/components/sellerdashboard/index.jsx
// ============================================================================
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layout/DashboardLayout';
import { sellerRoutes } from './routes/sellerRoutes';

const SellerDashboard = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        {sellerRoutes.map((route) => (
          <Route 
            key={route.path} 
            path={route.path} 
            element={route.element} 
          />
        ))}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default SellerDashboard;
