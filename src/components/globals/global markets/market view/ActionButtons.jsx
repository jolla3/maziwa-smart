import React from "react";
import { motion } from "framer-motion";
import { MessageCircle, PhoneCall } from "lucide-react";

const ActionButtons = ({ onChatClick, onContactClick, sellerAvailable }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="d-flex gap-3 mb-3"
    >
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="btn btn-primary btn-lg rounded-pill flex-grow-1 shadow"
        onClick={onChatClick}
        disabled={!sellerAvailable}
      >
        <MessageCircle size={20} className="me-2" />
        Chat with Seller
      </motion.button>
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="btn btn-outline-primary btn-lg rounded-circle shadow-sm"
        onClick={onContactClick}
        style={{ width: "56px", height: "56px" }}
      >
        <PhoneCall size={20} />
      </motion.button>
    </motion.div>
  );
};

export default ActionButtons;
  