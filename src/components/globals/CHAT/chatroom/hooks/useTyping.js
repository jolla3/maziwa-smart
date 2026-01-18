import { useCallback, useRef } from "react";

export const useTyping = (socketRef, receiverId) => {
  const typingTimeoutRef = useRef(null);

  const emitTyping = useCallback(() => {
    if (!socketRef.current?.connected || !receiverId) return;
    
    socketRef.current.emit("typing_start", { to: receiverId });
    
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current.emit("typing_stop", { to: receiverId });
    }, 1500);
  }, [socketRef, receiverId]);

  return { emitTyping };
};