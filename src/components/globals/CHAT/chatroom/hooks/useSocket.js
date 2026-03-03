// hooks/useSocket.js
import { useEffect, useRef, useState, useCallback } from "react";
import io from "socket.io-client";

const getSocketURL = () => {
  const apiBase = process.env.REACT_APP_API_BASE;
  if (!apiBase) {
    console.warn("⚠️ REACT_APP_API_BASE not found, using fallback");
    return "http://localhost:5000";
  }
  return apiBase.replace(/\/api$/, '');
};

export const useSocket = (receiverId, onNewMessage) => {
  const [socketConnected, setSocketConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Stable callback reference
  const onNewMessageRef = useRef(onNewMessage);
  useEffect(() => {
    onNewMessageRef.current = onNewMessage;
  }, [onNewMessage]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    
    if (!token) {
      console.log("❌ No token - skipping socket");
      setConnectionError("No authentication token");
      return;
    }
    
    if (!userId) {
      console.log("❌ No userId - skipping socket");
      return;
    }

    const SOCKET_URL = getSocketURL();
    console.log("🔌 Connecting to Socket.IO:", SOCKET_URL);

    // Only create socket if not already connected
    if (socketRef.current?.connected) {
      console.log("⚡ Socket already connected, reusing");
      return;
    }

    // Create new socket connection
    socketRef.current = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
    });

    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      setSocketConnected(true);
      setConnectionError(null);
    });

    // Handle incoming messages
    socket.on("new_message", (data) => {
      console.log("📩 New message received:", data);
      
      const transformedMessage = {
        _id: data._id || data.id,
        id: data._id || data.id,
        text: data.message || data.text,
        message: data.message || data.text,
        senderId: data.sender?.id || data.senderId,
        receiverId: data.receiver?.id || data.receiverId,
        from: "them",
        createdAt: data.created_at || data.createdAt || new Date().toISOString(),
        created_at: data.created_at || data.createdAt || new Date().toISOString(),
        isRead: data.isRead || false,
        listing: data.listing
      };
      
      if (onNewMessageRef.current) {
        onNewMessageRef.current(transformedMessage);
      }
    });

    // Handle typing indicators
    socket.on("typing_start", (data) => {
      console.log("⌨️ User typing:", data);
      if (data.from === receiverId) {
        setIsTyping(true);
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
      }
    });

    socket.on("typing_stop", (data) => {
      console.log("⌨️ User stopped typing");
      if (data.from === receiverId) {
        setIsTyping(false);
        clearTimeout(typingTimeoutRef.current);
      }
    });

    // Handle user status changes
    socket.on("user_status_change", (data) => {
      console.log("👤 User status change:", data);
    });

    socket.on("message_sent", (data) => {
      console.log("✅ Message sent confirmation:", data);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
      setSocketConnected(false);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err.message);
      setConnectionError(err.message);
      setSocketConnected(false);
    });

    // Cleanup on unmount
    return () => {
      console.log("🔌 Cleaning up socket");
      socket.off("new_message");
      socket.off("typing_start");
      socket.off("typing_stop");
      socket.off("user_status_change");
      socket.off("message_sent");
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [receiverId]); // Only re-run if receiverId changes

  // Expose methods
  const emitTyping = useCallback((to) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("typing_start", { to });
    }
  }, []);

  const emitTypingStop = useCallback((to) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("typing_stop", { to });
    }
  }, []);

  const emitMessage = useCallback((data) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("send_message", data);
    } else {
      console.warn("⚠️ Socket not connected");
    }
  }, []);

  return { 
    socketRef, 
    socketConnected, 
    connectionError, 
    isTyping,
    emitTyping,
    emitTypingStop,
    emitMessage
  };
};