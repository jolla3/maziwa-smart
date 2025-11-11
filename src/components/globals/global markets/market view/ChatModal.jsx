import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import ChatRoom from "../../CHAT/ChatRoom";

const ChatModal = ({ showChatModal, setShowChatModal, seller, listing }) => {
  // gracefully handle invalid or missing seller
  const sellerId = seller?._id || seller?.id;
  if (!showChatModal || !sellerId) return null;

  const onClose = () => setShowChatModal(false);

  return (
    <AnimatePresence>
      {showChatModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{
            zIndex: 9999,
            backgroundColor: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(2px)",
          }}
          // only close when clicking on overlay itself, not inside the modal
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="position-absolute top-50 start-50 translate-middle"
            style={{
              width: "90vw",
              height: "90vh",
              maxWidth: "1200px",
              maxHeight: "900px",
              borderRadius: "1rem",
              overflow: "hidden",
            }}
          >
            <div className="bg-white h-100 d-flex flex-column shadow-lg">
              {/* Header */}
              <div className="d-flex justify-content-between align-items-center p-3 border-bottom bg-light flex-shrink-0">
                <div>
                  <h5 className="mb-0 fw-bold">Chat with Seller</h5>
                  <small className="text-muted">
                    {seller?.fullname || seller?.name || "Seller"}
                  </small>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="btn btn-light rounded-circle d-flex align-items-center justify-content-center"
                  onClick={onClose}
                  style={{ width: 40, height: 40 }}
                >
                  <X size={20} />
                </motion.button>
              </div>

              {/* Chat Content */}
              <div className="flex-grow-1 overflow-hidden">
                <ChatRoom
                  receiverId={sellerId}
                  receiver={seller}
                  onBack={onClose}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatModal;
