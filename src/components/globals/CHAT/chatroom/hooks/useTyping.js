// hooks/useTyping.js
import { useCallback, useRef, useEffect } from "react";

export const useTyping = (socketRef, receiverId) => {
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      // If user was typing when unmounting, send stop
      if (isTypingRef.current && socketRef.current?.connected && receiverId) {
        socketRef.current.emit("typing_stop", { to: receiverId });
      }
    };
  }, [socketRef, receiverId]);

  const emitTyping = useCallback(() => {
    if (!socketRef.current?.connected || !receiverId) return;
    
    // Only emit typing start if not already typing
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socketRef.current.emit("typing_start", { to: receiverId });
      console.log("⌨️ Emitting typing_start to:", receiverId);
    }
    
    // Clear existing timeout and set new one
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      if (isTypingRef.current && socketRef.current?.connected) {
        isTypingRef.current = false;
        socketRef.current.emit("typing_stop", { to: receiverId });
        console.log("⌨️ Emitting typing_stop to:", receiverId);
      }
    }, 2000); // 2 seconds after last keystroke
  }, [socketRef, receiverId]);

  const emitTypingStop = useCallback(() => {
    if (!socketRef.current?.connected || !receiverId) return;
    
    clearTimeout(typingTimeoutRef.current);
    
    if (isTypingRef.current) {
      isTypingRef.current = false;
      socketRef.current.emit("typing_stop", { to: receiverId });
      console.log("⌨️ Emitting typing_stop to:", receiverId);
    }
  }, [socketRef, receiverId]);

  return { emitTyping, emitTypingStop };
};