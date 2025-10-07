import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { MessageSquare, Clock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const API_BASE = "https://maziwasmart.onrender.com/api";

export default function ChatList() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [recentChats, setRecentChats] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch recent chats
  useEffect(() => {
    if (!token) return;
    axios
      .get(`${API_BASE}/chat/recent`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.success) setRecentChats(res.data.recent);
      })
      .catch((err) => console.error("Error loading chats:", err))
      .finally(() => setLoading(false));
  }, [token]);

  const handleChatOpen = (chat) => {
    // ✅ Navigate to ChatRoom but without showing ID in the URL
    navigate("/chatroom", { state: { receiverId: chat._id, receiver: chat } });
  };

  const colors = {
    bg: "#f9fafc",
    card: "#ffffff",
    accent: "#4cceac",
    shadow: "0 4px 15px rgba(0,0,0,0.08)",
  };

  return (
    <div
      className="container-fluid p-0 d-flex flex-column vh-100"
      style={{ background: colors.bg, overflow: "hidden" }}
    >
      {/* Header */}
      <div
        className="p-3 border-bottom d-flex align-items-center justify-content-between"
        style={{
          background: colors.card,
          boxShadow: colors.shadow,
        }}
      >
        <h5 className="mb-0 fw-semibold">Messages</h5>
        <MessageSquare color={colors.accent} size={22} />
      </div>

      {/* Chat list */}
      <div className="flex-grow-1 overflow-auto p-3">
        {loading ? (
          <p className="text-center text-muted mt-5">Loading chats...</p>
        ) : recentChats.length === 0 ? (
          <div className="text-center text-muted mt-5">
            <User size={32} className="mb-2 text-secondary" />
            <p>No recent chats found</p>
          </div>
        ) : (
          recentChats.map((chat) => (
            <motion.div
              key={chat._id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleChatOpen(chat)}
              className="p-3 mb-3 rounded-4 d-flex justify-content-between align-items-center shadow-sm"
              style={{
                background: colors.card,
                cursor: "pointer",
                boxShadow: colors.shadow,
                transition: "0.3s",
              }}
            >
              {/* Left: Avatar + Info */}
              <div className="d-flex align-items-center gap-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                  style={{
                    width: 48,
                    height: 48,
                    background: `linear-gradient(135deg, ${colors.accent}, #70d8bd)`,
                    color: "white",
                    fontSize: 18,
                  }}
                >
                  {chat.name[0]?.toUpperCase() || "U"}
                </div>
                <div>
                  <div className="fw-semibold text-dark">{chat.name}</div>
                  <div className="text-muted small text-truncate" style={{ maxWidth: 180 }}>
                    {chat.lastMessage}
                  </div>
                </div>
              </div>

              {/* Right: Timestamp */}
              <div className="text-end">
                <small className="text-muted d-flex align-items-center gap-1">
                  <Clock size={14} />{" "}
                  {new Date(chat.lastActive).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </small>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
