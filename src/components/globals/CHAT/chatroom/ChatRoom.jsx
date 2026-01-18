import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import { AuthContext } from "../../../PrivateComponents/AuthContext";

// Components
import { Header } from "./components/Header";
import { MessageList } from "./components/buttons/MessageList";
import { InputArea } from "./components/buttons/InputArea";
import { UserProfileModal } from "./components/buttons/UserProfileModal";
import { ConnectionModal } from "./components/buttons/ConnectionModal";

// Hooks
import { useChatMessages } from "./hooks/useChatMessages";
import { useSocket } from "./hooks/useSocket";
import { useTyping } from "./hooks/useTyping";
import { useUserStatus } from "./hooks/useUserStatus";
import { useCallHandler } from "./hooks/useCallHandler";

// FIXED: Fallback if env var is missing
const API_BASE = process.env.REACT_APP_API_BASE 

export default function ChatRoom({ 
  receiverId: propReceiverId, 
  receiver: propReceiver,
  onBack: propOnBack 
} = {}) {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  // Extract receiverId and listingId from props or state
  const receiverId = propReceiverId || state?.receiverId || state?.receiver?._id;
  const listingId = state?.listing || state?.listingId || null;

  const [showProfile, setShowProfile] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log("🔍 ChatRoom Debug:");
    console.log("- API_BASE:", API_BASE);
    console.log("- receiverId:", receiverId);
    console.log("- token exists:", !!token);
    console.log("- listingId:", listingId);
  }, [receiverId, token, listingId]);

  // Theme configuration
  const theme = {
    bg: "linear-gradient(to bottom, #f8fafc 0%, #e0e7ff 100%)",
    header: "rgba(255, 255, 255, 0.95)",
    accent: "#6366f1",
    accentLight: "#818cf8",
    bubbleMine: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    bubbleTheirs: "#ffffff",
    text: "#1e293b",
    textMuted: "#64748b",
    border: "#e2e8f0",
    success: "#10b981",
    shadow: "0 2px 8px rgba(0,0,0,0.06)",
    shadowLg: "0 10px 25px rgba(99,102,241,0.2)",
  };

  // Setup axios
  useEffect(() => {
    if (token) {
      axios.defaults.baseURL = API_BASE;
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [token]);

  // Custom hooks
  const {
    messages,
    loading,
    counterpart,
    isOnline,
    lastSeen,
    setIsOnline,
    setLastSeen,
    sendMessage,
    addIncomingMessage
  } = useChatMessages(receiverId, listingId);

  const { socketRef, socketConnected, connectionError, isTyping } = useSocket(
    receiverId, 
    addIncomingMessage
  );
  
  const { emitTyping } = useTyping(socketRef, receiverId);
  useUserStatus(socketRef, receiverId, setIsOnline, setLastSeen);
  const { handleVoiceCall, handleWhatsAppChat } = useCallHandler(counterpart);

  // Handle back navigation
  const handleBack = () => {
    if (propOnBack) {
      propOnBack();
    } else {
      navigate("/recents");
    }
  };

  // Handle message send
  const handleSendMessage = (text, image) => {
    // Check if socket is connected before sending
    if (!socketConnected) {
      console.warn("⚠️ Socket not connected - message will only be sent via HTTP");
    }
    
    if (image) {
      // TODO: Implement image upload
      console.log("Image upload not yet implemented:", image);
    }
    if (text) {
      sendMessage(text);
    }
  };

  return (
    <div
      className="d-flex flex-column vh-100 position-relative"
      style={{
        background: theme.bg,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Header
        counterpart={counterpart}
        receiver={propReceiver}
        isOnline={isOnline}
        lastSeen={lastSeen}
        isTyping={isTyping}
        onBack={handleBack}
        onProfileClick={() => setShowProfile(true)}
        onVoiceCall={handleVoiceCall}
        onWhatsAppChat={handleWhatsAppChat}
        theme={theme}
      />

      {/* Messages */}
      <div
        className="flex-grow-1 p-4 overflow-auto"
        style={{ scrollBehavior: "smooth" }}
      >
        <MessageList
          messages={messages}
          loading={loading}
          isTyping={isTyping}
          theme={theme}
        />
      </div>

      {/* Input Area */}
      <InputArea
        onSend={handleSendMessage}
        onTyping={emitTyping}
        theme={theme}
      />

      {/* User Profile Modal */}
      <UserProfileModal
        show={showProfile}
        onClose={() => setShowProfile(false)}
        counterpart={counterpart}
        receiver={propReceiver}
        isOnline={isOnline}
        lastSeen={lastSeen}
        theme={theme}
      />

      {/* Connection Status Modal - Only shows when there's an issue */}
      <ConnectionModal
        socketConnected={socketConnected}
        connectionError={connectionError}
        loading={loading}
        theme={theme}
      />
    </div>
  );
}