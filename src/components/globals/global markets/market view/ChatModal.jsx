import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../PrivateComponents/AuthContext";

const ChatModal = ({ showChatModal, setShowChatModal, seller, listing }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const sellerId = seller?._id || seller?.id;
    if (!sellerId) return;

    if (showChatModal) {
      const senderId = user?.id;
      const senderType = user?.role; // Lowercase per schema
      const receiverId = sellerId;
      const receiverType = seller?.role || (seller?.farmer_code ? "farmer" : "user"); // Infer
      const listingId = listing?._id || null;
      const message = ""; // Stubbed initial message

      navigate("/chatroom", {
        state: {
          sender: { id: senderId, type: senderType },
          receiver: { id: receiverId, type: receiverType },
          listing: listingId,
          message: message.trim(),
          receiver: seller // Fallback for ChatRoom
        }
      });
      setShowChatModal(false);
    }
  }, [showChatModal, navigate, user, seller, listing, setShowChatModal]);

  return null;
};

export default ChatModal;