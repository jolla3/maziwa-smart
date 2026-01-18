import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const MESSAGE_CACHE_PREFIX = "chat_messages_";
const CACHE_EXPIRY_MS = 3600000; // 1 hour

export const useChatMessages = (receiverId, listingId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [counterpart, setCounterpart] = useState({});
  const [isOnline, setIsOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState(null);

  // Cache helpers with expiration
  const getCachedMessages = useCallback(() => {
    try {
      const cached = localStorage.getItem(`${MESSAGE_CACHE_PREFIX}${receiverId}`);
      if (!cached) return null;
      const parsed = JSON.parse(cached);
      const now = Date.now();
      if (parsed.timestamp && (now - parsed.timestamp) > CACHE_EXPIRY_MS) {
        localStorage.removeItem(`${MESSAGE_CACHE_PREFIX}${receiverId}`);
        return null;
      }
      return parsed.messages;
    } catch (err) {
      console.error("Error reading cached messages:", err);
      return null;
    }
  }, [receiverId]);

  const setCachedMessages = useCallback((msgs) => {
    try {
      localStorage.setItem(`${MESSAGE_CACHE_PREFIX}${receiverId}`, JSON.stringify({
        messages: msgs,
        timestamp: Date.now()
      }));
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
        // FIXED: Use "/chat" since axios.baseURL already includes "/api"
        const res = await axios.get(`/chat/${receiverId}`);
        if (res.data.success) {
          const msgs = res.data.messages || [];
          setMessages(msgs);
          setCachedMessages(msgs);
          
          if (res.data.counterpart) {
            setCounterpart(res.data.counterpart);
            // Removed: isOnline and lastSeen as backend doesn't provide them yet
            // setIsOnline(res.data.counterpart.is_online || false);
            // setLastSeen(res.data.counterpart.last_seen || null);
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

  // Send message - FIXED: Immediately show message locally, with validation
  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || text.length > 2000) return; // Added: Length validation to match backend
    
    const tempId = `temp_${Date.now()}`;
    const userId = localStorage.getItem("userId");
    
    const temp = {
      _id: tempId, // Standardized: Use _id as primary
      id: tempId,
      from: "me",
      senderId: userId,
      text,
      createdAt: new Date().toISOString(),
      isSending: true,
    };
    
    // IMMEDIATELY add to messages array so user sees it
    setMessages((prev) => {
      const updated = [...prev, temp];
      setCachedMessages(updated);
      return updated;
    });

    try {
      // FIXED: Use "/chat" since axios.baseURL already includes "/api"
      const res = await axios.post("/chat", {
        receiverId,
        message: text,
        listingId
      });
      
      // Replace temp message with real one from server
      setMessages((prev) => {
        const updated = prev.map((m) =>
          m._id === tempId // Standardized: Check _id primarily
            ? { ...res.data.message, _id: res.data.message._id || res.data.message.id, from: "me", senderId: userId }
            : m
        );
        setCachedMessages(updated);
        return updated;
      });
    } catch (err) {
      console.error("Send error:", err);
      // Mark message as failed but keep it visible
      setMessages((prev) => {
        const updated = prev.map((m) =>
          m._id === tempId // Standardized: Check _id primarily
            ? { ...m, isSending: false, failed: true }
            : m
        );
        setCachedMessages(updated);
        return updated;
      });
    }
  }, [receiverId, listingId, setCachedMessages]);

  // Add new incoming message
  const addIncomingMessage = useCallback((newMsg) => {
    setMessages((prev) => {
      // Avoid duplicates
      const exists = prev.some(m => m._id === newMsg._id || m.id === newMsg.id);
      if (exists) return prev;
      
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