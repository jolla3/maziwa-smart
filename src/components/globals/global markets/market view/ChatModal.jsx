import  { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../PrivateComponents/AuthContext";

const ChatModal = ({ showChatModal, setShowChatModal, seller, listing }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
  if (!showChatModal) return;

  const receiverId = seller?._id;
  if (!receiverId || !user?.id) return;

  navigate("/chatroom", {
    state: {
      receiverId,
      listingId: listing?._id || null,
    }
  });

  setShowChatModal(false);
}, [showChatModal, navigate, seller?._id, user?.id, listing?._id, setShowChatModal]);

  return null;
};

export default ChatModal;