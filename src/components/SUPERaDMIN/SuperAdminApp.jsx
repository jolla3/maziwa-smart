import React, { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { AuthContext } from '../PrivateComponents/AuthContext';
import SuperAdminLayout from './layouts/SuperAdminLayout';

const SuperAdminApp = () => {
  const { user, token } = useContext(AuthContext);

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'superadmin') {
    return <Navigate to="/" replace />;
  }

  return (
    <SuperAdminLayout>
      <Outlet />
    </SuperAdminLayout>
  );
};

export default SuperAdminApp;