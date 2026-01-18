import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { formatMessageDate } from "../../utils/time";

export const MessageList = ({ messages, loading, isTyping, theme }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (loading) {
    return (
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
    );
  }

  if (!messages.length) {
    return (
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
    );
  }

  return (
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
                  {formatMessageDate(m.createdAt)}
                </span>
              </div>
            )}
            <MessageBubble message={m} isMine={isMine} theme={theme} />
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
                {[0, 0.2, 0.4].map((delay, idx) => (
                  <motion.div
                    key={idx}
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay }}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: theme.textMuted,
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={messagesEndRef} />
    </>
  );
};