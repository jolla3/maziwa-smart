import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const MESSAGE_CACHE_PREFIX = "chat_messages_";

export const useChatMessages = (receiverId, listingId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [counterpart, setCounterpart] = useState({});
  const [isOnline, setIsOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState(null);

  // Cache helpers
  const getCachedMessages = useCallback(() => {
    try {
      const cached = localStorage.getItem(`${MESSAGE_CACHE_PREFIX}${receiverId}`);
      return cached ? JSON.parse(cached) : null;
    } catch (err) {
      console.error("Error reading cached messages:", err);
      return null;
    }
  }, [receiverId]);

  const setCachedMessages = useCallback((msgs) => {
    try {
      localStorage.setItem(`${MESSAGE_CACHE_PREFIX}${receiverId}`, JSON.stringify(msgs));
    } catch (err) {
      console.error("Error caching messages:", err);
    }
  }, [receiverId]);

  // Fetch conversation
  useEffect(() => {
    if (!receiverId) return;

    // Load cached messages first
    const cached = getCachedMessages();
    if (cached && cached.length > 0) {
      setMessages(cached);
      setLoading(false);
    }

    const fetchChat = async () => {
      try {
        const res = await axios.get(`/chat/${receiverId}`);
        if (res.data.success) {
          const msgs = res.data.messages || [];
          setMessages(msgs);
          setCachedMessages(msgs);
          
          if (res.data.counterpart) {
            setCounterpart(res.data.counterpart);
            setIsOnline(res.data.counterpart.is_online || false);
            setLastSeen(res.data.counterpart.last_seen || null);
          }
        }
      } catch (err) {
        console.error("Chat fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchChat();
  }, [receiverId, getCachedMessages, setCachedMessages]);

  // Send message
  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return;
    
    const tempId = `temp_${Date.now()}`;
    const temp = {
      id: tempId,
      from: "me",
      text,
      createdAt: new Date().toISOString(),
      isSending: true,
    };
    
    setMessages((prev) => {
      const updated = [...prev, temp];
      setCachedMessages(updated);
      return updated;
    });

    try {
      const res = await axios.post("/chat", {
        receiverId,
        message: text,
        listingId
      });
      
      // Replace temp message with real one
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempId ? { ...res.data.message, from: "me" } : m
        )
      );
    } catch (err) {
      console.error("Send error:", err);
      // Mark message as failed
      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? { ...m, isSending: false, failed: true } : m))
      );
    }
  }, [receiverId, listingId, setCachedMessages]);

  // Add new incoming message
  const addIncomingMessage = useCallback((newMsg) => {
    setMessages((prev) => {
      const updated = [...prev, { ...newMsg, from: "them" }];
      setCachedMessages(updated);
      return updated;
    });
  }, [setCachedMessages]);

  return {
    messages,
    loading,
    counterpart,
    isOnline,
    lastSeen,
    setIsOnline,
    setLastSeen,
    setCounterpart,
    sendMessage,
    addIncomingMessage
  };
};