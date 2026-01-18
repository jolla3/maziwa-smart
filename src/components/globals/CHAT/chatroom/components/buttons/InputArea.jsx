import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Send, Smile, Paperclip, X } from "lucide-react";
import { EmojiPickerWrapper } from "./EmojiPickerWrapper";

export const InputArea = ({ onSend, onTyping, onImageSelect, theme }) => {
  const [message, setMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleSend = () => {
    if (!message.trim() && !selectedImage) return;
    
    onSend(message.trim(), selectedImage);
    setMessage("");
    setSelectedImage(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        onImageSelect?.(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div
        className="p-3 border-top"
        style={{
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 -2px 10px rgba(0,0,0,0.05)",
        }}
      >
        {/* Image preview */}
        {selectedImage && (
          <div className="mb-2 position-relative d-inline-block">
            <img
              src={selectedImage}
              alt="preview"
              style={{
                maxWidth: 200,
                maxHeight: 200,
                borderRadius: 12,
                objectFit: "cover",
              }}
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedImage(null)}
              className="btn btn-danger rounded-circle p-1 position-absolute"
              style={{ top: -8, right: -8, width: 28, height: 28 }}
            >
              <X size={16} />
            </motion.button>
          </div>
        )}

        <div className="d-flex align-items-end gap-2">
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
              onChange={handleImageChange}
            />
          </motion.button>

          <textarea
            rows={1}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              onTyping?.();
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
                handleSend();
              }
            }}
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!message.trim() && !selectedImage}
            className="btn text-white rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: 42,
              height: 42,
              background: (message.trim() || selectedImage) ? theme.bubbleMine : theme.textMuted,
              border: "none",
              boxShadow: (message.trim() || selectedImage) ? theme.shadowLg : "none",
              flexShrink: 0,
            }}
          >
            <Send size={20} />
          </motion.button>
        </div>
      </div>

      <EmojiPickerWrapper
        show={showEmoji}
        onClose={() => setShowEmoji(false)}
        onEmojiClick={(emojiData) => {
          setMessage((prev) => prev + emojiData.emoji);
          setShowEmoji(false);
        }}
        theme={theme}
      />
    </>
  );
};