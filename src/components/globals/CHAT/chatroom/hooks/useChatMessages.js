// hooks/useChatMessages.js
import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";

const MESSAGE_CACHE_PREFIX = "chat_messages_";
const CACHE_EXPIRY_MS = 3600000; // 1 hour

export const useChatMessages = (receiverId, listingId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [counterpart, setCounterpart] = useState({});
  const [isOnline, setIsOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState(null);

  const userIdRef = useRef(localStorage.getItem("userId"));

  // Update userId ref when it changes
  useEffect(() => {
    userIdRef.current = localStorage.getItem("userId");
  }, []);

  // Cache helpers with expiration
  const getCachedMessages = useCallback(() => {
    if (!receiverId) return null;
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
    if (!receiverId) return;
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

    // Load cached messages first for instant display
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
            // ✅ FIXED: Get online status from backend
            setIsOnline(res.data.counterpart.isOnline || false);
            setLastSeen(res.data.counterpart.lastSeen || null);
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

  // Send message - immediately show locally
  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || text.length > 2000) return;
    
    const tempId = `temp_${Date.now()}`;
    const currentUserId = userIdRef.current;
    
    const temp = {
      _id: tempId,
      id: tempId,
      from: "me",
      senderId: currentUserId,
      text,
      message: text,
      createdAt: new Date().toISOString(),
      created_at: new Date().toISOString(),
      isSending: true,
      isRead: false,
    };
    
    // IMMEDIATELY add to UI
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
      
      if (res.data.success) {
        // Replace temp with real message from server
        setMessages((prev) => {
          const updated = prev.map((m) =>
            m._id === tempId
              ? { ...res.data.message, _id: res.data.message._id, from: "me", senderId: currentUserId }
              : m
          );
          setCachedMessages(updated);
          return updated;
        });
      }
    } catch (err) {
      console.error("Send error:", err);
      // Mark as failed but keep visible
      setMessages((prev) => {
        const updated = prev.map((m) =>
          m._id === tempId
            ? { ...m, isSending: false, failed: true }
            : m
        );
        setCachedMessages(updated);
        return updated;
      });
    }
  }, [receiverId, listingId, setCachedMessages]);

  // Add incoming message from socket
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

  // Update online status externally (from useUserStatus)
  const updateOnlineStatus = useCallback((online, lastSeenTime) => {
    setIsOnline(online);
    if (lastSeenTime) setLastSeen(lastSeenTime);
  }, []);

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
    addIncomingMessage,
    updateOnlineStatus
  };
};