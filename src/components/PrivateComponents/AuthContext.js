// src/context/AuthContext.js
import { createContext, useCallback, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const isAuthenticated = Boolean(token && user);

  const hardResetAuth = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }, []);

  const logout = useCallback(() => {
    hardResetAuth();
    navigate("/login", { replace: true });
  }, [hardResetAuth, navigate]);

  useEffect(() => {
    if (!token) {
      hardResetAuth();
      return;
    }

    try {
      const decoded = jwtDecode(token);

      // Expired token = instant death
      if (!decoded?.exp || decoded.exp * 1000 < Date.now()) {
        hardResetAuth();
        return;
      }

      setUser(decoded);
      localStorage.setItem("user", JSON.stringify(decoded));
    } catch (err) {
      // Invalid token = instant death
      hardResetAuth();
    }
  }, [token, hardResetAuth]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        setToken,
        setUser,
        logout,
        hardResetAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
