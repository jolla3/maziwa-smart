import React, { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../PrivateComponents/AuthContext';
import { jwtDecode } from 'jwt-decode';

const GoogleCallbackHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setToken } = useContext(AuthContext);

 useEffect(() => {
  const params = new URLSearchParams(location.search);
  const token = params.get('token');
  const role = params.get('role');
  const error = params.get('error');

  if (error) {
    return navigate('/login', { replace: true });
  }

  // First-time Google user
  if (token && !role) {
    return navigate(`/set-password?token=${token}`, { replace: true });
  }

  // Existing user
  if (token && role) {
    setToken(token); // <-- ONLY THIS

    const roleRoutes = {
      admin: '/admindashboard',
      superadmin: '/spr.dmn',
      seller: '/slr.drb',
      buyer: '/byr.drb',
      farmer: '/fmr.drb',
      porter: '/porterdashboard',
      manager: '/man.drb',
    };

    return navigate(roleRoutes[role], { replace: true });
  }

  navigate('/login', { replace: true });
}, [location, navigate, setToken]);


  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <p>Redirecting...</p>
    </div>
  );
};

export default GoogleCallbackHandler;
