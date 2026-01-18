import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Phone, Video, MoreVertical, Circle } from "lucide-react";
import { formatLastSeen } from "../utils/time";

export const Header = ({
  counterpart,
  receiver,
  isOnline,
  lastSeen,
  isTyping,
  onBack,
  onProfileClick,
  onVoiceCall,
  onWhatsAppChat,
  theme
}) => {
  return (
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
          onClick={onBack}
          className="btn btn-light border-0 rounded-circle p-2 d-flex align-items-center justify-content-center"
          style={{ width: 40, height: 40 }}
        >
          <ArrowLeft size={20} color={theme.text} />
        </motion.button>

        <div
          className="d-flex align-items-center gap-3 flex-grow-1"
          onClick={onProfileClick}
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
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onVoiceCall}
          className="btn btn-light border-0 rounded-circle p-2"
          style={{ width: 40, height: 40 }}
          title="Call"
        >
          <Phone size={18} color={theme.accent} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onWhatsAppChat}
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
    </motion.div>
  );
};