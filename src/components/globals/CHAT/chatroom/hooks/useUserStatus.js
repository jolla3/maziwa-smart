// hooks/useUserStatus.js
import { useEffect, useRef } from "react";

export const useUserStatus = (socketRef, receiverId, setIsOnline, setLastSeen) => {
  const receiverIdRef = useRef(receiverId);
  
  // Keep receiverId ref updated
  useEffect(() => {
    receiverIdRef.current = receiverId;
  }, [receiverId]);

  useEffect(() => {
    if (!socketRef?.current || !receiverId) return;
    
    const socket = socketRef.current;
    const currentReceiverId = receiverId;

    console.log(`📡 Requesting status for user: ${currentReceiverId}`);

    // Request current status immediately
    socket.emit("get_user_status", { userId: currentReceiverId });

    // Listen for status updates
    const handleStatus = (data) => {
      console.log("📊 Received status:", data);
      if (data.userId === currentReceiverId || data.userId === receiverIdRef.current) {
        setIsOnline(data.isOnline);
        setLastSeen(data.lastSeen);
      }
    };

    // Listen for status change events (when user comes online/offline)
    const handleStatusChange = (data) => {
      console.log("📊 Status change event:", data);
      if (data.userId === currentReceiverId || data.userId === receiverIdRef.current) {
        setIsOnline(data.isOnline);
        if (!data.isOnline && data.timestamp) {
          setLastSeen(data.timestamp);
        }
      }
    };

    // Listen for user coming online
    const handleUserOnline = (data) => {
      console.log("🟢 User came online:", data);
      if (data.userId === currentReceiverId || data.userId === receiverIdRef.current) {
        setIsOnline(true);
        setLastSeen(null);
      }
    };

    // Listen for user going offline
    const handleUserOffline = (data) => {
      console.log("🔴 User went offline:", data);
      if (data.userId === currentReceiverId || data.userId === receiverIdRef.current) {
        setIsOnline(false);
        setLastSeen(data.lastSeen || new Date().toISOString());
      }
    };

    socket.on("user_status", handleStatus);
    socket.on("user_status_change", handleStatusChange);
    socket.on("user_online", handleUserOnline);
    socket.on("user_offline", handleUserOffline);
    
    // Cleanup
    return () => {
      socket.off("user_status", handleStatus);
      socket.off("user_status_change", handleStatusChange);
      socket.off("user_online", handleUserOnline);
      socket.off("user_offline", handleUserOffline);
    };
  }, [socketRef, receiverId, setIsOnline, setLastSeen]);
};