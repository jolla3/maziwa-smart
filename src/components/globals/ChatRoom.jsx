import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Send, Check, CheckCheck, Paperclip, Image, Mic, StopCircle, Play, Smile, X
} from "lucide-react";
import EmojiPicker from "emoji-picker-react";

const API_BASE = "https://maziwasmart.onrender.com/api";
const SOCKET_URL = "https://maziwasmart.onrender.com";

export default function ChatRoom() {
  const { state } = useLocation();
  const { receiverId, receiver } = state || {};

  const token = localStorage.getItem("token");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // setup axios headers
  useEffect(() => {
    if (token) {
      axios.defaults.baseURL = API_BASE;
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [token]);

  // fetch messages
  useEffect(() => {
    if (!receiverId) return;
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/chat/${receiverId}`);
        if (res.data.success) {
          setMessages(res.data.messages || []);
        }
      } catch (err) {
        console.error("Chat fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [receiverId]);

  // socket setup
  useEffect(() => {
    if (!token) return;
    socketRef.current = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    socketRef.current.on("connect", () => {
      setSocketConnected(true);
      socketRef.current.emit("join_room", receiverId);
    });

    socketRef.current.on("new_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socketRef.current.on("typing_start", (data) => {
      if (data.from === receiverId) setIsTyping(true);
    });
    socketRef.current.on("typing_stop", (data) => {
      if (data.from === receiverId) setIsTyping(false);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [token, receiverId]);

  // typing emitter
  const emitTyping = () => {
    if (!socketRef.current?.connected) return;
    socketRef.current.emit("typing_start", { to: receiverId });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current.emit("typing_stop", { to: receiverId });
    }, 1500);
  };

  // send message
  const sendMessage = async () => {
    if (!message.trim()) return;
    const tempMsg = {
      id: Date.now(),
      from: "me",
      text: message,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    setMessages((prev) => [...prev, tempMsg]);
    setMessage("");

    try {
      await axios.post("/chat", {
        receiverId,
        message: tempMsg.text,
      });
    } catch (err) {
      console.error("Send error:", err);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const theme = {
    bg: "#f2f5f9",
    header: "rgba(255,255,255,0.7)",
    bubbleMine: "linear-gradient(135deg,#4cceac,#70d8bd)",
    bubbleTheirs: "rgba(255,255,255,0.9)",
    accent: "#4cceac",
  };

  return (
    <div
      className="container-fluid p-0 d-flex flex-column vh-100"
      style={{
        background: theme.bg,
        overflow: "hidden",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Header */}
      <div
        className="p-3 border-bottom d-flex align-items-center justify-content-between sticky-top"
        style={{
          background: theme.header,
          backdropFilter: "blur(10px)",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        }}
      >
        <div>
          <h6 className="mb-0 fw-semibold">{receiver?.name || "Chat"}</h6>
          <small className="text-muted">
            {isTyping ? "typing..." : socketConnected ? "Online" : "Offline"}
          </small>
        </div>
        <div className="text-success small">●</div>
      </div>

      {/* Messages */}
      <div className="flex-grow-1 p-3 overflow-auto">
        {loading ? (
          <p className="text-center text-muted mt-5">Loading messages...</p>
        ) : messages.length ? (
          messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`d-flex mb-3 ${
                m.from === "me" ? "justify-content-end" : "justify-content-start"
              }`}
            >
              <div
                className="p-3 rounded-4 shadow-sm"
                style={{
                  maxWidth: "70%",
                  background:
                    m.from === "me" ? theme.bubbleMine : theme.bubbleTheirs,
                  color: m.from === "me" ? "white" : "#333",
                  boxShadow:
                    m.from === "me"
                      ? "0 8px 25px rgba(76,206,172,0.3)"
                      : "0 4px 10px rgba(0,0,0,0.1)",
                }}
              >
                <div>{m.text}</div>
                <div className="text-end mt-1 small text-muted">
                  {new Date(m.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  {m.from === "me" &&
                    (m.isRead ? (
                      <CheckCheck size={14} />
                    ) : (
                      <Check size={14} />
                    ))}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center text-muted mt-5">
            No messages yet — start a conversation!
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div
        className="p-3 border-top d-flex align-items-center gap-2 bg-white"
        style={{
          boxShadow: "0 -3px 10px rgba(0,0,0,0.08)",
        }}
      >
        <button
          className="btn btn-light border-0"
          onClick={() => setShowEmoji((v) => !v)}
          style={{ borderRadius: 12 }}
        >
          <Smile size={22} color={theme.accent} />
        </button>

        <label className="btn btn-light border-0 mb-0" style={{ borderRadius: 12 }}>
          <Paperclip size={20} color={theme.accent} />
          <input type="file" hidden accept="image/*" />
        </label>

        <textarea
          rows={1}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            emitTyping();
          }}
          placeholder="Type a message..."
          className="form-control border-0 bg-light"
          style={{
            resize: "none",
            borderRadius: 12,
            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)",
          }}
          onKeyDown={(e) =>
            e.key === "Enter" && !e.shiftKey && sendMessage()
          }
        />

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={sendMessage}
          className="btn text-white"
          style={{
            background: theme.accent,
            borderRadius: 12,
            boxShadow: "0 4px 15px rgba(76,206,172,0.4)",
          }}
        >
          <Send size={20} />
        </motion.button>
      </div>

      {/* Emoji picker */}
      {showEmoji && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="position-absolute bottom-20 start-0 end-0 mx-auto w-fit mb-5"
        >
          <EmojiPicker
            onEmojiClick={(emojiData) =>
              setMessage((prev) => prev + emojiData.emoji)
            }
            theme="light"
          />
        </motion.div>
      )}
    </div>
  );
}
