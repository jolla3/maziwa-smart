import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SuperAdminLayout from './layouts/SuperAdminLayout';
import DashboardPage from './pages/DashboardPage';
import AlertsPage from './pages/AlertsPage';
import EventsPage from './pages/EventsPage';
import AuditPage from './pages/AuditPage';
import ConfigPage from './pages/ConfigPage';
import SessionsPage from './pages/SessionsPage';
import AdminSellerRequests from './AdminSellerRequests';

const SuperAdminRoutes = () => {
  return (
    <SuperAdminLayout>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="alerts" element={<AlertsPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="audit" element={<AuditPage />} />
        <Route path="config" element={<ConfigPage />} />
        <Route path="sessions" element={<SessionsPage />} />
        <Route path="admin-approval" element={<AdminSellerRequests />} />
      </Routes>
    </SuperAdminLayout>
  );
};

export default SuperAdminRoutes;
