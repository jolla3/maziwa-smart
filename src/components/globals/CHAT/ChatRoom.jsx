import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import io from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { parsePhoneNumberFromString, getCountryCallingCode } from "libphonenumber-js";
import {
  Send, Check, CheckCheck, Paperclip, Smile, ArrowLeft, 
  User, MoreVertical, Phone, Video,
  X, Download, Circle
} from "lucide-react";
import EmojiPicker from "emoji-picker-react";

const API_BASE =     process.env.REACT_APP_API_BASE
const SOCKET_URL =     process.env.API_BASE
const MESSAGE_CACHE_PREFIX = "chat_messages_";

// NEW CODE:
export default function ChatRoom({ 
  receiverId: propReceiverId, 
  receiver: propReceiver,
  onBack: propOnBack 
} = {}) {
  const { state } = useLocation();
  const navigate = useNavigate();
  
  // Use props if provided, otherwise fall back to location state
  const receiverId = propReceiverId || state?.receiverId;
  const receiver = propReceiver || state?.receiver;

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [lastSeen, setLastSeen] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
const [selectedImage, setSelectedImage] = useState(null);
const [counterpart, setCounterpart] = useState(receiver || {});

// --- Call hooks ---
// (Removed duplicate useCallHandler declaration here)

const socketRef = useRef(null);
const messagesEndRef = useRef(null);
const typingTimeoutRef = useRef(null);
const fileInputRef = useRef(null);

  const theme = {
    bg: "linear-gradient(to bottom, #f8fafc 0%, #e0e7ff 100%)",
    header: "rgba(255, 255, 255, 0.95)",
    accent: "#6366f1",
    accentLight: "#818cf8",
    bubbleMine: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    bubbleTheirs: "#ffffff",
    text: "#1e293b",
    textMuted: "#64748b",
    border: "#e2e8f0",
    success: "#10b981",
    shadow: "0 2px 8px rgba(0,0,0,0.06)",
    shadowLg: "0 10px 25px rgba(99,102,241,0.2)",
  };

  // Cache messages
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

  // Setup axios
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.baseURL = API_BASE;
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

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
          
          // Set counterpart data properly
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

 // ✅ Socket setup
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

  // Add inside useEffect after socket connects
socket.on("new_message", (newMsg) => {
  console.log("📩 Incoming message:", newMsg);
  setMessages((prev) => {
    const updated = [...prev, { ...newMsg, from: "them" }];
    setCachedMessages(updated);
    return updated;
  });
});


  socket.on("disconnect", () => setSocketConnected(false));
  socket.on("connect_error", (err) => console.error("Socket error:", err));

  return () => socket.off("new_message");

}, [receiverId]);
// --- Online/offline status and call handling helpers ---
const useUserStatus = (socketRef, receiverId, setIsOnline, setLastSeen) => {
  useEffect(() => {
    if (!socketRef.current || !receiverId) return;
    const socket = socketRef.current;

    // Ask server for the user's current status immediately
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

// ✅ Real-time online/offline updates
useUserStatus(socketRef, receiverId, setIsOnline, setLastSeen);

// --- Call hooks ---
const useCallHandler = (socketRef, receiverId, type = "voice") => {
  return useCallback(() => {
    if (!socketRef.current || !receiverId) return;

    const callId = `${type}_${Date.now()}`;
    socketRef.current.emit("initiate_call", { receiverId, callId, type });

    alert(
      `${type === "video" ? "🎥" : "📞"} ${type.toUpperCase()} call started!\n` +
      "This can later be integrated with WebRTC for real streaming."
    );
  }, [socketRef, receiverId, type]);
};

// Use call handlers for buttons

  // Typing handler
  const emitTyping = useCallback(() => {
    if (!socketRef.current?.connected) return;
    socketRef.current.emit("typing_start", { to: receiverId });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current.emit("typing_stop", { to: receiverId });
    }, 1500);
  }, [receiverId]);

  // Send message
  const sendMessage = useCallback(async () => {
    if (!message.trim()) return;
    const text = message.trim();
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
    setMessage("");

    try {
      const res = await axios.post("/chat", { receiverId, message: text });
      
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
  }, [message, receiverId, setCachedMessages]);

  // Handle image upload
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Format time
  const formatTime = (iso) => {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      if (isNaN(d.getTime())) return "";
      
      const now = new Date();
      const isToday = d.toDateString() === now.toDateString();
      
      if (isToday) {
        return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      }
      return d.toLocaleDateString([], { month: "short", day: "numeric" }) + 
             " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch (err) {
      return "";
    }
  };

  const formatLastSeen = (date) => {
    if (!date) return "Offline";
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return "Offline";
      
      const now = new Date();
      const diffMs = now - d;
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins < 1) return "Active now";
      if (diffMins < 60) return `Active ${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `Active ${diffHours}h ago`;
      return `Last seen ${d.toLocaleDateString()}`;
    } catch (err) {
      return "Offline";
    }
  };


// ✅ Helper: Sanitize and normalize
const sanitizePhone = (phone) => {
  if (!phone) return null;
  const str = String(phone).replace(/\D/g, ""); // keep digits only
  return str.length >= 7 ? str : null;
};

// ✅ Helper: Get browser’s country (automatically detects region)
const getBrowserCountryCode = () => {
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale; // e.g. "en-KE"
    const region = locale.split("-")[1]; // → "KE"
    if (!region) return "254"; // fallback Kenya
    return getCountryCallingCode(region.toUpperCase()) 
  } catch {
    return "254"; // fallback to Kenya
  }
};

// ✅ Helper: Detect mobile vs desktop
const isMobileDevice = () =>
  /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent);

// ☎️ Voice Call
const handleVoiceCall = () => {
  const phone = sanitizePhone(counterpart?.phone);
  if (!phone) return alert("Phone number not available for this user.");
  window.open(`tel:${phone}`);
};

// 💬 WhatsApp Chat
const handleWhatsAppChat = () => {
  let phone = sanitizePhone(counterpart?.phone);
  if (!phone) return alert("WhatsApp number not available for this user.");

  // Add leading zero if 9 digits (common Kenya style)
  if (phone.length === 9) phone = `0${phone}`;

  // Determine proper international code dynamically
  const code = getBrowserCountryCode();

  // If number missing code, prepend it
  if (!phone.startsWith(code) && !phone.startsWith(`+${code}`)) {
    if (phone.startsWith("0")) phone = phone.substring(1);
    phone = `${code}${phone}`;
  }

  const waURL = isMobileDevice()
    ? `whatsapp://send?phone=${phone}`
    : `https://wa.me/${phone}`;

  window.open(waURL, "_blank");
};
  return (
    <div
      className="d-flex flex-column vh-100 position-relative"
      style={{
        background: theme.bg,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="p-3 border-bottom d-flex align-items-center justify-content-between"
        style={{
          background: theme.header,
          backdropFilter: "blur(20px)",
          boxShadow: theme.shadowLg,
          zIndex: 10,
        }}
      >
        <div className="d-flex align-items-center gap-2 flex-grow-1">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
           onClick={() => propOnBack ? propOnBack() : navigate("/recents")}
            className="btn btn-light border-0 rounded-circle p-2 d-flex align-items-center justify-content-center"
            style={{ width: 40, height: 40 }}
          >
            <ArrowLeft size={20} color={theme.text} />
          </motion.button>

          <div
            className="d-flex align-items-center gap-3 flex-grow-1"
            onClick={() => setShowProfile(true)}
            style={{ cursor: "pointer" }}
          >
            <div className="position-relative">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                style={{
                  width: 44,
                  height: 44,
                  background: theme.bubbleMine,
                  boxShadow: theme.shadow,
                }}
              >
                {(counterpart?.displayName?.[0] || counterpart?.name?.[0] || receiver?.name?.[0] || "?").toUpperCase()}
              </div>
              {isOnline && (
                <Circle
                  size={12}
                  fill={theme.success}
                  color={theme.success}
                  className="position-absolute"
                  style={{ bottom: 0, right: 0, border: "2px solid white", borderRadius: "50%" }}
                />
              )}
            </div>
            <div className="flex-grow-1" style={{ minWidth: 0 }}>
              <h6 className="mb-0 fw-bold" style={{ color: theme.text }}>
                {counterpart?.displayName || counterpart?.name || receiver?.name || "Chat"}
              </h6>
              <small style={{ color: theme.textMuted, fontSize: "13px" }}>
                {isTyping ? (
                  <span className="fw-medium" style={{ color: theme.accent }}>
                    typing...
                  </span>
                ) : isOnline ? (
                  "Active now"
                ) : (
                  formatLastSeen(lastSeen)
                )}
              </small>
            </div>
          </div>
        </div>

        <div className="d-flex gap-2">
          <div className="d-flex gap-2">
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={handleVoiceCall}
    className="btn btn-light border-0 rounded-circle p-2"
    style={{ width: 40, height: 40 }}
    title="Call"
  >
    <Phone size={18} color={theme.accent} />
  </motion.button>

  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={handleWhatsAppChat}
    className="btn btn-light border-0 rounded-circle p-2"
    style={{ width: 40, height: 40 }}
    title="WhatsApp Chat"
  >
    <Video size={18} color={theme.accent} />
  </motion.button>

  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="btn btn-light border-0 rounded-circle p-2"
    style={{ width: 40, height: 40 }}
    title="More Options"
  >
    <MoreVertical size={18} color={theme.text} />
  </motion.button>
</div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-light border-0 rounded-circle p-2"
            style={{ width: 40, height: 40 }}
          >
            <MoreVertical size={18} color={theme.text} />
          </motion.button>
        </div>
      </motion.div>

      {/* Connection status indicator */}
      <AnimatePresence>
        {!socketConnected && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center py-2"
            style={{
              background: "#fef3c7",
              fontSize: "13px",
              color: "#92400e",
              fontWeight: 500,
            }}
          >
            Fetching Messages...
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div
        className="flex-grow-1 p-4 overflow-auto"
        style={{ scrollBehavior: "smooth" }}
      >
        {loading ? (
          <div className="d-flex justify-content-center align-items-center h-100">
            <div className="text-center">
              <div
                className="spinner-border mb-3"
                style={{ color: theme.accent, width: 40, height: 40 }}
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </div>
              <p style={{ color: theme.textMuted }}>Loading messages...</p>
            </div>
          </div>
        ) : messages.length ? (
          <>
            {messages.map((m, i) => {
              const isMine = m.from === "me" || m.senderId === localStorage.getItem("userId");
              const showDate = i === 0 || 
                new Date(messages[i - 1].createdAt).toDateString() !== 
                new Date(m.createdAt).toDateString();

              return (
                <React.Fragment key={m.id || m._id || i}>
                  {showDate && (
                    <div className="text-center my-3">
                      <span
                        className="px-3 py-1 rounded-pill small"
                        style={{
                          background: "rgba(255,255,255,0.7)",
                          color: theme.textMuted,
                          fontSize: "12px",
                        }}
                      >
                        {(() => {
                          try {
                            const msgDate = new Date(m.createdAt);
                            if (isNaN(msgDate.getTime())) return "";
                            return msgDate.toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "short",
                              day: "numeric",
                            });
                          } catch {
                            return "";
                          }
                        })()}
                      </span>
                    </div>
                  )}
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className={`d-flex mb-3 ${
                      isMine ? "justify-content-end" : "justify-content-start"
                    }`}
                  >
                    <div
                      className="p-3 rounded-4 position-relative"
                      style={{
                        maxWidth: "75%",
                        background: isMine ? theme.bubbleMine : theme.bubbleTheirs,
                        color: isMine ? "white" : theme.text,
                        boxShadow: isMine ? theme.shadowLg : theme.shadow,
                        border: isMine ? "none" : `1px solid ${theme.border}`,
                      }}
                    >
                      <div style={{ wordBreak: "break-word" }}>{m.text}</div>
                      <div
                        className={`d-flex align-items-center gap-1 mt-1 ${
                          isMine ? "justify-content-end" : "justify-content-start"
                        }`}
                        style={{
                          fontSize: "11px",
                          opacity: 0.8,
                          color: isMine ? "rgba(255,255,255,0.9)" : theme.textMuted,
                        }}
                      >
                        <span>{formatTime(m.createdAt)}</span>
                        {isMine && (
                          <>
                            {m.isSending ? (
                              <div
                                className="spinner-border spinner-border-sm"
                                style={{ width: 12, height: 12 }}
                              />
                            ) : m.failed ? (
                              <span style={{ color: "#ef4444" }}>!</span>
                            ) : m.isRead ? (
                              <CheckCheck size={14} />
                            ) : (
                              <Check size={14} />
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </React.Fragment>
              );
            })}

            {/* Typing indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="d-flex justify-content-start mb-3"
                >
                  <div
                    className="p-3 rounded-4"
                    style={{
                      background: theme.bubbleTheirs,
                      boxShadow: theme.shadow,
                      border: `1px solid ${theme.border}`,
                    }}
                  >
                    <div className="d-flex gap-1">
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: theme.textMuted,
                        }}
                      />
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: theme.textMuted,
                        }}
                      />
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: theme.textMuted,
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <div className="d-flex justify-content-center align-items-center h-100">
            <div className="text-center">
              <div
                className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                style={{
                  width: 80,
                  height: 80,
                  background: `${theme.accent}15`,
                }}
              >
                <Send size={36} color={theme.accent} />
              </div>
              <h5 style={{ color: theme.text }}>No messages yet</h5>
              <p style={{ color: theme.textMuted }}>
                Start the conversation by sending a message
              </p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div
        className="p-3 border-top d-flex align-items-end gap-2"
        style={{
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 -2px 10px rgba(0,0,0,0.05)",
        }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-light border-0 rounded-circle d-flex align-items-center justify-content-center"
          onClick={() => setShowEmoji((v) => !v)}
          style={{ width: 42, height: 42, flexShrink: 0 }}
        >
          <Smile size={20} color={theme.accent} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-light border-0 rounded-circle d-flex align-items-center justify-content-center"
          onClick={() => fileInputRef.current?.click()}
          style={{ width: 42, height: 42, flexShrink: 0 }}
        >
          <Paperclip size={20} color={theme.accent} />
          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageSelect}
          />
        </motion.button>

        <textarea
          rows={1}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            emitTyping();
          }}
          placeholder="Type a message..."
          className="form-control border-0"
          style={{
            resize: "none",
            borderRadius: 14,
            background: "#f1f5f9",
            padding: "12px 16px",
            maxHeight: 100,
            fontSize: "15px",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={sendMessage}
          disabled={!message.trim()}
          className="btn text-white rounded-circle d-flex align-items-center justify-content-center"
          style={{
            width: 42,
            height: 42,
            background: message.trim() ? theme.bubbleMine : theme.textMuted,
            border: "none",
            boxShadow: message.trim() ? theme.shadowLg : "none",
            flexShrink: 0,
          }}
        >
          <Send size={20} />
        </motion.button>
      </div>

      {/* Emoji picker */}
      <AnimatePresence>
        {showEmoji && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="position-fixed top-0 start-0 w-100 h-100"
              style={{ zIndex: 999 }}
              onClick={() => setShowEmoji(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.9 }}
              className="position-absolute"
              style={{
                bottom: 90,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 1000,
                boxShadow: theme.shadowLg,
                borderRadius: 16,
                overflow: "hidden",
              }}
            >
              <EmojiPicker
                onEmojiClick={(emojiData) => {
                  setMessage((prev) => prev + emojiData.emoji);
                  setShowEmoji(false);
                }}
                theme="light"
                height={400}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

    <AnimatePresence>
  {showProfile && (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        exit={{ opacity: 0 }}
        className="position-fixed top-0 start-0 w-100 h-100"
        style={{
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(6px)",
          zIndex: 1040,
        }}
        onClick={() => setShowProfile(false)}
      />

      {/* Center wrapper (handles responsiveness) */}
      <motion.div
        className="position-fixed w-100 d-flex justify-content-center"
        style={{
          top: "5%",
          zIndex: 1050,
          pointerEvents: "none", // allows clicks to pass outside popup
        }}
      >
        {/* Popup box */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="shadow-lg rounded-4 overflow-hidden"
          style={{
            pointerEvents: "auto",
            width: "90%",
            maxWidth: "420px",
            background: "#fff",
            borderRadius: "20px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: theme.bubbleMine,
              padding: "24px",
              position: "relative",
            }}
          >
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="btn border-0 rounded-circle p-2 position-absolute"
              style={{
                top: 16,
                right: 16,
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
              }}
              onClick={() => setShowProfile(false)}
            >
              <X size={20} color="white" />
            </motion.button>

            <div className="text-center pt-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center fw-bold mx-auto mb-3"
                style={{
                  width: 100,
                  height: 100,
                  background: "white",
                  color: theme.accent,
                  fontSize: 40,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                }}
              >
                {(counterpart?.displayName?.[0] ||
                  counterpart?.name?.[0] ||
                  receiver?.name?.[0] ||
                  "?"
                ).toUpperCase()}
              </div>
              <h4 className="fw-bold mb-2 text-white">
                {counterpart?.displayName ||
                  counterpart?.name ||
                  receiver?.name ||
                  "User"}
              </h4>
              <div
                className="d-inline-block px-3 py-1 rounded-pill"
                style={{
                  background: "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <small className="text-white fw-medium">
                  {isOnline ? (
                    <>
                      <Circle
                        size={8}
                        fill="#10b981"
                        color="#10b981"
                        className="me-1"
                      />
                      Active now
                    </>
                  ) : (
                    formatLastSeen(lastSeen)
                  )}
                </small>
              </div>
            </div>
          </div>

          {/* Info */}
          <div
            style={{
              background: "#1e293b",
              padding: "24px",
            }}
          >
            <h6 className="text-white-50 text-uppercase small fw-bold mb-3 d-flex align-items-center gap-2">
              <User size={16} />
              Contact Information
            </h6>

            <div className="d-flex flex-column gap-3">
  {/* Email */}
  {counterpart?.email && String(counterpart.email).trim() !== "" && (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-3 rounded-3"
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <div className="d-flex align-items-start gap-3">
        <div
          className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
          style={{
            width: 40,
            height: 40,
            background: "rgba(99,102,241,0.2)",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </div>
        <div className="flex-grow-1">
          <small className="text-white-50 d-block mb-1">Email Address</small>
          <p className="mb-0 text-white fw-medium" style={{ wordBreak: "break-all" }}>
            {counterpart.email}
          </p>
        </div>
      </div>
    </motion.div>
  )}

  {/* Phone */}
  {counterpart?.phone && String(counterpart.phone).trim() !== "" && (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="p-3 rounded-3"
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <div className="d-flex align-items-start gap-3">
        <div
          className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
          style={{
            width: 40,
            height: 40,
            background: "rgba(16,185,129,0.2)",
          }}
        >
          <Phone size={18} color="#10b981" />
        </div>
        <div className="flex-grow-1">
          <small className="text-white-50 d-block mb-1">Phone Number</small>
          <p className="mb-0 text-white fw-medium" style={{ wordBreak: "break-all" }}>
            {String(counterpart.phone)}
          </p>
        </div>
      </div>
    </motion.div>
  )}

  {/* Location */}
{(counterpart?.location || counterpart?.Location || counterpart?.location_description) && (
  <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="p-3 rounded-3"
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <div className="d-flex align-items-start gap-3">
        <div
          className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
          style={{
            width: 40,
            height: 40,
            background: "rgba(245,158,11,0.2)",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
        <div className="flex-grow-1">
          <small className="text-white-50 d-block mb-1">Location</small>
          <p className="mb-0 text-white fw-medium" style={{ wordBreak: "break-word" }}>
              {String(counterpart?.location || counterpart?.Location || counterpart?.location_description || "Unknown")}
          </p>
        </div>
      </div>
    </motion.div>
  )}

  {/* Fallback */}
  {!counterpart?.email && !counterpart?.phone && !counterpart?.location && (
    <div className="text-center py-4">
      <p className="text-white-50 mb-0">No additional information available</p>
    </div>
  )}
</div>
          </div>
        </motion.div>
      </motion.div>
    </>
  )}
</AnimatePresence>


    </div>
  );
}