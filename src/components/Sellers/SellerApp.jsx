import React, { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { AuthContext } from '../PrivateComponents/AuthContext';
import SellerLayout from './layout/SellerLayout';

const SellerApp = () => {
  const { user, token } = useContext(AuthContext);

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'seller') {
    return <Navigate to="/" replace />;
  }

  return (
    <SellerLayout>
      <Outlet />
    </SellerLayout>
  );
};

export default SellerApp;