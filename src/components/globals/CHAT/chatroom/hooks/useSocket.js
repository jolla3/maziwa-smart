import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

// CRITICAL FIX: Remove /api for Socket.IO, but keep it for axios
const getSocketURL = () => {
  const apiBase = process.env.REACT_APP_API_BASE;
  if (!apiBase) {
    console.warn("⚠️ REACT_APP_API_BASE not found, using fallback");
    return "http://localhost:5000";
  }
  
  // Remove /api suffix for Socket.IO (socket connects to root)
  return apiBase.replace(/\/api$/, '');
};

const SOCKET_URL = getSocketURL();

export const useSocket = (receiverId, onNewMessage) => {
  const [socketConnected, setSocketConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      console.log("❌ No token found - skipping socket connection");
      setConnectionError("No authentication token");
      return;
    }
    
    if (!receiverId) {
      console.log("❌ No receiverId - skipping socket connection");
      return;
    }

    console.log("🔌 Connecting to Socket.IO:", SOCKET_URL);
    console.log("📍 For receiver:", receiverId);

    // Initialize socket with your backend's exact setup
    socketRef.current = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
      autoConnect: true,
    });

    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      setSocketConnected(true);
      setConnectionError(null);
      
      // Your backend joins socket.join(userId) automatically
      // No need to emit join_chat - backend does it on connection
      console.log("📡 Socket ready for messages");
    });

    // Listen for new messages (your backend emits to receiver's room)
    socket.on("new_message", (data) => {
      console.log("📩 New message received:", data);
      
      // Transform backend message format to frontend format
      const transformedMessage = {
        _id: data._id || data.id,
        id: data._id || data.id,
        text: data.message,
        senderId: data.sender?.id,
        receiverId: data.receiver?.id,
        from: "them", // incoming message
        createdAt: data.created_at || data.createdAt || new Date().toISOString(),
        isRead: data.isRead || false,
        listing: data.listing
      };
      
      onNewMessage(transformedMessage);
    });

    socket.on("typing_start", (data) => {
      console.log("⌨️ User typing:", data);
      setIsTyping(true);
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
    });

    socket.on("typing_stop", () => {
      console.log("⌨️ User stopped typing");
      setIsTyping(false);
      clearTimeout(typingTimeoutRef.current);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
      setSocketConnected(false);
      
      if (reason === "io server disconnect") {
        socket.connect();
      }
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err.message);
      setSocketConnected(false);
      setConnectionError(err.message);
    });

    socket.on("error", (err) => {
      console.error("❌ Socket error:", err);
      setConnectionError(err.message || "Unknown error");
    });

    return () => {
      console.log("🔌 Cleaning up socket");
      socket.off("new_message");
      socket.off("typing_start");
      socket.off("typing_stop");
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.off("error");
      socket.disconnect();
    };
  }, [receiverId, onNewMessage]);

  return { socketRef, socketConnected, connectionError, isTyping };
};