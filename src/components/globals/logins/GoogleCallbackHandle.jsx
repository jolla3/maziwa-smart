import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const GoogleCallbackHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const role = params.get('role');
    const name = params.get('name');
    const error = params.get('error');

    // 1️⃣ Backend error
    if (error) {
      console.error('Google login error:', decodeURIComponent(error));
      return navigate('/login', { replace: true });
    }

    // 2️⃣ First-time Google user → set password
    if (token && !role) {
      return navigate(`/set-password?token=${token}`, { replace: true });
    }

    // 3️⃣ Existing Google user
    if (token && role) {
      localStorage.setItem('token', token); 
      localStorage.setItem('role', role);
      if (name) localStorage.setItem('userName', decodeURIComponent(name));

      // Redirect by role
      const roleRoutes = {
        admin: '/admindashboard',
        superadmin: '/superadmindashboard',
        seller: '/sellerdashboard',
        buyer: '/buyerdashboard',
        farmer: '/farmerdashboard',
        porter: '/porterdashboard',
        broker: '/brokerdashboard',
        manager: '/managerdashboard',
      };

      return navigate(roleRoutes[role] || '/dashboard', { replace: true });
    }

    // 4️⃣ Catch-all fallback
    navigate('/login', { replace: true });

  }, [location, navigate]);

  // Optionally render a tiny loader while redirecting
  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <p>Redirecting...</p>
    </div>
  );
};

export default GoogleCallbackHandler;
