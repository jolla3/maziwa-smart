import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import EmojiPicker from "emoji-picker-react";

export const EmojiPickerWrapper = ({ show, onClose, onEmojiClick, theme }) => {
  // Detect mobile device
  const isMobile = window.innerWidth <= 768;
  
  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{ zIndex: 999 }}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            className="position-fixed"
            style={{
              bottom: isMobile ? 80 : 90,
              left: isMobile ? "50%" : "50%",
              transform: "translateX(-50%)",
              zIndex: 1000,
              boxShadow: theme.shadowLg,
              borderRadius: 16,
              overflow: "hidden",
              width: isMobile ? "95vw" : "auto",
              maxWidth: isMobile ? "95vw" : "420px",
            }}
          >
            <EmojiPicker
              onEmojiClick={onEmojiClick}
              theme="light"
              height={isMobile ? 350 : 400}
              width={isMobile ? "100%" : 420}
              searchDisabled={isMobile}
              skinTonesDisabled={isMobile}
              previewConfig={{
                showPreview: !isMobile
              }}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};