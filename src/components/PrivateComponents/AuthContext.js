// src/context/AuthContext.js
import { createContext, useCallback, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

const safeDecode = (token) => {
  try {
    const decoded = jwtDecode(token);
    if (!decoded?.exp || decoded.exp * 1000 < Date.now()) return null;
    return decoded;
  } catch {
    return null;
  }
};

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setTokenState] = useState(() => localStorage.getItem("token"));

  // 🔒 derive user ONCE from token
  const user = useMemo(() => {
    if (!token) return null;
    return safeDecode(token);
  }, [token]);

  const isAuthenticated = Boolean(user);

  const setToken = useCallback((newToken) => {
    if (!newToken) {
      localStorage.removeItem("token");
      setTokenState(null);
      return;
    }

    const decoded = safeDecode(newToken);
    if (!decoded) {
      localStorage.removeItem("token");
      setTokenState(null);
      return;
    }

    localStorage.setItem("token", newToken);
    setTokenState(newToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setTokenState(null);
    navigate("/login", { replace: true });
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        setToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
