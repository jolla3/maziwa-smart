import React, { useEffect, useState, useCallback, useContext } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, 
  Clock, 
  User, 
  Search, 
  RefreshCw,
  ChevronRight,
  Inbox,
  Mail,
  Phone as PhoneIcon
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthContext } from "../../PrivateComponents/AuthContext";

const API_BASE = process.env.REACT_APP_API_BASE;
const CACHE_KEY = "chatlist_cache";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export default function ChatList() {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  
  const [recentChats, setRecentChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added error state
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const colors = {
    primary: "#6366f1",
    primaryLight: "#818cf8",
    primaryDark: "#4f46e5",
    bg: "linear-gradient(to bottom right, #f8fafc, #e0e7ff)",
    card: "#ffffff",
    cardHover: "#fefefe",
    text: "#1e293b",
    textMuted: "#64748b",
    border: "#e2e8f0",
    shadow: "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)",
    shadowHover: "0 10px 25px rgba(99,102,241,0.15), 0 4px 10px rgba(0,0,0,0.08)",
    success: "#10b981",
    error: "#ef4444", // Added for error UI
  };

  // Get cached data
  const getCachedData = useCallback(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          return data;
        }
      }
    } catch (err) {
      console.error("Error reading cache:", err);
    }
    return null;
  }, []);

  // Save to cache
  const setCachedData = useCallback((data) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (err) {
      console.error("Error saving cache:", err);
    }
  }, []);

  // Fetch chats
  const fetchChats = useCallback(async (showRefreshing = false) => {
    if (!token) {
      setLoading(false);
      return;
    }
    if (showRefreshing) setRefreshing(true);
    setError(null); // Clear error
    try {
      const res = await axios.get(`${API_BASE}/chat/recent`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success && res.data.recent) {
        setRecentChats(res.data.recent);
        setFilteredChats(res.data.recent);
        setCachedData(res.data.recent);
      }
    } catch (err) {
      console.error("Error loading chats:", err);
      setError("Failed to load chats—check connection or try refresh.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [setCachedData, token]);

  // Initial load with cache
  useEffect(() => {
    const cachedChats = getCachedData();
    if (cachedChats && cachedChats.length > 0) {
      setRecentChats(cachedChats);
      setFilteredChats(cachedChats);
      setLoading(false);
      // Fetch fresh data in background
      fetchChats(false);
    } else {
      fetchChats(false);
    }
  }, [getCachedData, fetchChats]);

  // Search filter
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredChats(recentChats);
      return;
    }
    const filtered = recentChats.filter((chat) =>
      chat.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredChats(filtered);
  }, [searchQuery, recentChats]);

  const handleChatOpen = useCallback((chat) => {
    navigate("/chatroom", { state: { receiverId: chat.id, receiver: chat } });
  }, [navigate]);

  const handleRefresh = () => {
    fetchChats(true);
  };

  // Format time
  const formatTime = useCallback((date) => {
    const now = new Date();
    const msgDate = new Date(date);
    const diffMs = now - msgDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return "now";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d`;
   
    return msgDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }, []);

  // Get avatar gradient
  const getAvatarGradient = (name) => {
    const gradients = [
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
    ];
    const index = (name?.charCodeAt(0) || 0) % gradients.length;
    return gradients[index];
  };

  return (
    <div
      className="d-flex flex-column vh-100 position-relative"
      style={{ 
        background: colors.bg,
        overflow: "hidden"
      }}
    >
      {/* Decorative background elements */}
      <div 
        style={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />
      <div 
        style={{
          position: "absolute",
          bottom: -150,
          left: -150,
          width: 400,
          height: 400,
          background: "radial-gradient(circle, rgba(129,140,248,0.08) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="px-4 pt-4 pb-3 position-relative"
        style={{
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${colors.border}`,
          zIndex: 10,
        }}
      >
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <h3 className="mb-1 fw-bold" style={{ color: colors.text }}>
              Messages
            </h3>
            <p className="mb-0 small" style={{ color: colors.textMuted }}>
              {filteredChats.length} conversation{filteredChats.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="d-flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05, rotate: 180 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              disabled={refreshing}
              className="btn rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: 44,
                height: 44,
                background: refreshing ? colors.textMuted : colors.primary,
                border: "none",
                boxShadow: colors.shadow,
              }}
            >
              <RefreshCw 
                size={20} 
                color="white" 
                className={refreshing ? "spinner-border spinner-border-sm" : ""}
                style={{ animation: refreshing ? "spin 1s linear infinite" : "none" }}
              />
            </motion.button>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: 44,
                height: 44,
                background: colors.primary,
                boxShadow: colors.shadow,
              }}
            >
              <MessageSquare color="white" size={20} strokeWidth={2.5} />
            </motion.div>
          </div>
        </div>

        {/* Search bar */}
        <div className="position-relative">
          <Search
            size={18}
            className="position-absolute"
            style={{ 
              left: 16, 
              top: "50%", 
              transform: "translateY(-50%)",
              color: colors.textMuted 
            }}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: `1px solid ${colors.border}`,
              borderRadius: "14px",
              padding: "12px 16px 12px 44px",
              fontSize: "15px",
              background: "white",
              transition: "all 0.3s",
              outline: "none",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = colors.primary;
              e.target.style.boxShadow = `0 0 0 3px rgba(99,102,241,0.1)`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = colors.border;
              e.target.style.boxShadow = "none";
            }}
          />
        </div>
      </motion.div>

      {/* Chat list */}
      <div 
        className="flex-grow-1 overflow-auto px-4 py-3" 
        style={{ scrollBehavior: "smooth" }}
      >
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-5"
          >
            <div 
              className="spinner-border mb-3" 
              style={{ color: colors.primary, width: 40, height: 40 }}
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            <p style={{ color: colors.textMuted }}>Loading conversations...</p>
          </motion.div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mt-5 p-5 rounded-4"
            style={{ 
              background: "white",
              boxShadow: colors.shadow,
              border: `1px solid ${colors.error}`,
            }}
          >
            <Inbox size={36} style={{ color: colors.error }} />
            <h5 className="mb-2" style={{ color: colors.error }}>
              Error Loading Chats
            </h5>
            <p className="mb-2" style={{ color: colors.textMuted }}>
              {error}
            </p>
            <button
              onClick={handleRefresh}
              className="btn btn-sm btn-outline-primary rounded-pill"
            >
              Retry
            </button>
          </motion.div>
        ) : filteredChats.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mt-5 p-5 rounded-4"
            style={{ 
              background: "white",
              boxShadow: colors.shadow,
            }}
          >
            <div 
              className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{
                width: 80,
                height: 80,
                background: `${colors.primary}10`,
              }}
            >
              {searchQuery ? (
                <Search size={36} style={{ color: colors.primary }} />
              ) : (
                <Inbox size={36} style={{ color: colors.primary }} />
              )}
            </div>
            <h5 className="mb-2" style={{ color: colors.text }}>
              {searchQuery ? "No results found" : "No conversations yet"}
            </h5>
            <p className="mb-0" style={{ color: colors.textMuted }}>
              {searchQuery ? "Try searching for something else" : "Start chatting to see your messages here"}
            </p>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredChats.map((chat, index) => (
              <motion.div
                key={chat.id} // Changed to chat.id from enriched
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleChatOpen(chat)}
                className="mb-3 p-3 rounded-4 d-flex align-items-center justify-content-between position-relative"
                style={{
                  background: "white",
                  cursor: "pointer",
                  boxShadow: colors.shadow,
                  border: `1px solid ${colors.border}`,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = colors.shadowHover;
                  e.currentTarget.style.borderColor = colors.primary;
                  e.currentTarget.style.background = colors.cardHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = colors.shadow;
                  e.currentTarget.style.borderColor = colors.border;
                  e.currentTarget.style.background = "white";
                }}
              >
                {/* Avatar + Info */}
                <div className="d-flex align-items-center gap-3 flex-grow-1" style={{ minWidth: 0 }}>
                  <div className="position-relative" style={{ flexShrink: 0 }}>
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                      style={{
                        width: 54,
                        height: 54,
                        background: getAvatarGradient(chat.name),
                        color: "white",
                        fontSize: 20,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    >
                      {chat.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    {index < 3 && ( // Example online indicator; replace with real if available
                      <span
                        className="position-absolute rounded-circle border border-3 border-white"
                        style={{
                          width: 14,
                          height: 14,
                          background: colors.success,
                          bottom: 2,
                          right: 2,
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        }}
                      />
                    )}
                  </div>
                  <div className="flex-grow-1" style={{ minWidth: 0 }}>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <div className="fw-bold" style={{ color: colors.text, fontSize: "16px" }}>
                        {chat.name}
                      </div>
                      {chat.phone && (
                        <small style={{ color: colors.textMuted, fontSize: "12px" }}>
                          <PhoneIcon size={12} className="me-1" />
                          {chat.phone}
                        </small>
                      )}
                    </div>
                    <div 
                      className="text-truncate d-flex align-items-center gap-2" 
                      style={{ 
                        color: colors.textMuted, 
                        fontSize: "14px",
                        maxWidth: "100%"
                      }}
                    >
                      {chat.lastMessage || "No messages yet"}
                      {chat.email && (
                        <small>
                          <Mail size={12} className="ms-2" />
                        </small>
                      )}
                    </div>
                  </div>
                </div>

                {/* Time + Arrow */}
                <div className="d-flex flex-column align-items-end gap-2" style={{ flexShrink: 0 }}>
                  <small 
                    className="d-flex align-items-center gap-1 fw-medium" 
                    style={{ color: colors.textMuted, fontSize: "12px" }}
                  >
                    <Clock size={12} />
                    {formatTime(chat.lastAt)} 
                    
                  </small>
                  <motion.div
                    whileHover={{ x: 3 }}
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: 28,
                      height: 28,
                      background: `${colors.primary}10`,
                    }}
                  >
                    <ChevronRight size={16} style={{ color: colors.primary }} />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}