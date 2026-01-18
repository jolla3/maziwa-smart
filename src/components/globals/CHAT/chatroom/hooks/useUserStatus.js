import { useEffect } from "react";

export const useUserStatus = (socketRef, receiverId, setIsOnline, setLastSeen) => {
  useEffect(() => {
    if (!socketRef.current || !receiverId) return;
    
    const socket = socketRef.current;

    // Request current status
    socket.emit("get_user_status", { userId: receiverId });

    const handleStatus = (data) => {
      if (data.userId === receiverId) {
        setIsOnline(data.isOnline);
        setLastSeen(data.lastSeen);
      }
    };

    socket.on("user_status", handleStatus);
    
    return () => socket.off("user_status", handleStatus);
  }, [socketRef, receiverId, setIsOnline, setLastSeen]);
};