import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

// FIXED: Fallback to default if env var is missing
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5001";

export const useSocket = (receiverId, onNewMessage) => {
  const [socketConnected, setSocketConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);

 useEffect(() => {
  // ADD: Debug log to check env var
  console.log("🔧 SOCKET_URL from env:", process.env.REACT_APP_SOCKET_URL);
  
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

    // Log connection attempt
    console.log("🔌 Attempting to connect to:", SOCKET_URL);
    console.log("📍 Receiver ID:", receiverId);
    console.log("🔑 Token exists:", !!token);

    // Initialize socket - matching your backend setup
    socketRef.current = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
      autoConnect: true,
    });

    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("✅ Socket connected successfully:", socket.id);
      setSocketConnected(true);
      setConnectionError(null);
      
      // FIXED: Backend handles room joining automatically on connect (socket.join(userId))
      // No need to emit "join_room" - remove to avoid mismatch
    });

    // Listen for incoming messages (your backend emits "new_message")
    socket.on("new_message", (doc) => {
      console.log("📩 Incoming raw message:", doc);

      const normalized = {
        _id: doc._id, // Standardized: Use _id as primary
        id: doc._id,
        from: "them",
        text: doc.message,
        isRead: doc.isRead,
        createdAt: doc.created_at,
        listing: doc.listing || null,
      };

      onNewMessage(normalized);
    });

    socket.on("typing_start", (data) => {
      console.log("⌨️ User is typing:", data);
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
        // Server initiated disconnect, try to reconnect
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
      console.log("🔌 Cleaning up socket connection");
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