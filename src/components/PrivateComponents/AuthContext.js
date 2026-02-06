// src/context/AuthContext.js
import { createContext, useCallback, useMemo, useState, useEffect } from "react";  // <-- ADD: useEffect
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { io } from 'socket.io-client';  // <-- ADD: Named import for Socket.IO

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
  const [socket, setSocket] = useState(null);  // <-- ADD: Socket state

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
    socket?.disconnect();  // <-- ADD: Disconnect socket on logout
    navigate("/login", { replace: true });
  }, [navigate, socket]);

  // <-- ADD: Global Socket.IO Connection
  useEffect(() => {
    if (token && !socket) {
      const BASE_URL = process.env.REACT_APP_API_BASE?.replace('/api', '') || 'http://localhost:5000';
      const newSocket = io(BASE_URL, {
        auth: { token },  // <-- INTEGRATED: Uses your JWT token for auth
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      newSocket.on('connect', () => {
        console.log('Global socket connected:', newSocket.id);  // <-- ADD: Debug log
      });

      newSocket.on('connect_error', (err) => {
        console.error('Global socket error:', err);  // <-- ADD: Debug log
      });

      setSocket(newSocket);
    }

    return () => socket?.disconnect();  // <-- ADD: Cleanup on unmount
  }, [token, socket]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        setToken,
        logout,
        socket,  // <-- ADD: Expose socket to components
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };