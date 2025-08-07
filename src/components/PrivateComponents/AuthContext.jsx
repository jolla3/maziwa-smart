// src/context/AuthContext.js
import { createContext, useCallback, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';  // ✅ Fixed
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem('user') || 'null')
  );

  // Logout function
  const logout = useCallback(() => {
    localStorage.clear();
    setToken('');
    setUser(null);
    navigate('/login');
  }, [navigate]);

  // Check token expiry on app load
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const isExpired = decoded.exp * 1000 < Date.now();
        if (isExpired) {
          logout();
        }
      } catch (error) {
        logout(); // Invalid token
      }
    }
  }, [token, logout]);

  return (
    <AuthContext.Provider value={{ token, user, setUser, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
