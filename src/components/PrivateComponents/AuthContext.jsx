// src/context/AuthContext.js
import { createContext, useCallback, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem('user') || 'null')
  );

  const logout = useCallback(() => {
    localStorage.clear();
    setToken('');
    setUser(null);
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const isExpired = decoded.exp * 1000 < Date.now();

      if (isExpired) {
        logout();
        return;
      }

      setUser(decoded);
      localStorage.setItem('user', JSON.stringify(decoded));

    } catch (err) {
      console.warn("Token decode failed during Google redirect, ignoring.");
      // No logout here
    }
  }, [token, logout]);

  return (
    <AuthContext.Provider value={{ token, user, setUser, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
