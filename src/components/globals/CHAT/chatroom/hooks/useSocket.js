import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_API_BASE;

export const useSocket = (receiverId, onNewMessage) => {
  const [socketConnected, setSocketConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !receiverId) return;

    socketRef.current = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("✅ Socket connected");
      setSocketConnected(true);
      socket.emit("join_chat", { receiverId });
    });

    socket.on("new_message", (newMsg) => {
      console.log("📩 Incoming message:", newMsg);
      onNewMessage(newMsg);
    });

    socket.on("typing_start", () => {
      setIsTyping(true);
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
    });

    socket.on("typing_stop", () => {
      setIsTyping(false);
      clearTimeout(typingTimeoutRef.current);
    });

    socket.on("disconnect", () => setSocketConnected(false));
    socket.on("connect_error", (err) => console.error("Socket error:", err));

    return () => {
      socket.off("new_message");
      socket.off("typing_start");
      socket.off("typing_stop");
      socket.disconnect();
    };
  }, [receiverId, onNewMessage]);

  return { socketRef, socketConnected, isTyping };
};