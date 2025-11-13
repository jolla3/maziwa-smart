import React, { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../PrivateComponents/AuthContext';
import { jwtDecode } from 'jwt-decode';

const GoogleCallbackHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setToken, setUser } = useContext(AuthContext);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const role = params.get('role');
    const name = params.get('name');
    const error = params.get('error');

    if (error) {
      console.error('Google login error:', decodeURIComponent(error));
      return navigate('/login', { replace: true });
    }

    // First-time Google user
    if (token && !role) {
      return navigate(`/set-password?token=${token}`, { replace: true });
    }

    // Existing user
    if (token && role) {
      // Update Global Auth Context
      try {
        const decoded = jwtDecode(token);

        setToken(token);
        setUser(decoded);

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(decoded));
        localStorage.setItem('role', role);
        if (name) localStorage.setItem('userName', decodeURIComponent(name));

      } catch (err) {
        console.error("Token decode failed:", err);
      }

      const roleRoutes = {
        admin: '/admindashboard',
        superadmin: '/superadmindashboard',
        seller: '/slr.drb',
        buyer: '/byr.drb',
        farmer: '/fmr.drb',
        porter: '/porterdashboard',
        broker: '/brokerdashboard',
        manager: '/man.drb',
      };

      return navigate(roleRoutes[role] || '/dashboard', { replace: true });
    }

    navigate('/login', { replace: true });

  }, [location, navigate, setToken, setUser]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <p>Redirecting...</p>
    </div>
  );
};

export default GoogleCallbackHandler;
