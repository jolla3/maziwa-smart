import React from "react";
import { motion } from "framer-motion";
import { Check, CheckCheck } from "lucide-react";
import { formatTime } from "../../utils/time";

export const MessageBubble = ({ message, isMine, theme }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`d-flex mb-3 ${isMine ? "justify-content-end" : "justify-content-start"}`}
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
        {/* Message text */}
        <div style={{ wordBreak: "break-word" }}>{message.text}</div>

        {/* Image if exists */}
        {message.imageUrl && (
          <img
            src={message.imageUrl}
            alt="attachment"
            className="mt-2 rounded-3"
            style={{ maxWidth: "100%", maxHeight: 300, objectFit: "cover" }}
          />
        )}

        {/* Timestamp and status */}
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
          <span>{formatTime(message.createdAt)}</span>
          {isMine && (
            <>
              {message.isSending ? (
                <div
                  className="spinner-border spinner-border-sm"
                  style={{ width: 12, height: 12 }}
                />
              ) : message.failed ? (
                <span style={{ color: "#ef4444" }}>!</span>
              ) : message.isRead ? (
                <CheckCheck size={14} />
              ) : (
                <Check size={14} />
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};