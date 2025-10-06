import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Smile, 
  Paperclip, 
  Phone, 
  Video, 
  MoreVertical, 
  ArrowLeft, 
  Check, 
  CheckCheck,
  WifiOff,
  AlertCircle
} from 'lucide-react';
import io from 'socket.io-client';

const API_BASE = 'https://maziwasmart.onrender.com/api';
const SOCKET_URL = 'https://maziwasmart.onrender.com';

// Theme colors
const colors = {
  primary: '#6870fa',
  secondary: '#4cceac',
  blueAccent: '#868dfb',
  greenAccent: '#70d8bd',
  redAccent: '#db4f4a',
  yellowAccent: '#ffe14a',
  grey: {
    light: '#f0f0f0',
    medium: '#9f9f9f',
    dark: '#2e2e2e',
  },
  background: {
    dark: '#0A0A0A',
    paper: '#141b2d',
  }
};

// ==================== UTILITY FUNCTIONS ====================

// Format date dividers
const formatDateDivider = (date) => {
  const today = new Date();
  const msgDate = new Date(date);
  const diffDays = Math.floor((today - msgDate) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return msgDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Group messages by date
const groupMessagesByDate = (messages) => {
  const groups = {};
  messages.forEach((msg) => {
    const date = new Date(msg.createdAt).toDateString();
    if (!groups[date]) groups[date] = [];
    groups[date].push(msg);
  });
  return groups;
};

// ==================== SUBCOMPONENTS ====================

// Skeleton Loader for Messages
const MessageSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    {[1, 2, 3].map((i) => (
      <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
        <div className="w-2/3 h-16 rounded-2xl bg-white/10"></div>
      </div>
    ))}
  </div>
);

// Date Divider Component
const DateDivider = ({ date }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex justify-center my-4"
  >
    <div className="px-4 py-1 rounded-full bg-white/10 backdrop-blur-xl text-white/60 text-xs">
      {formatDateDivider(date)}
    </div>
  </motion.div>
);

// ChatHeader Component
const ChatHeader = React.memo(({ counterpart, onBack, isOnline }) => (
  <motion.div
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    className="relative overflow-hidden rounded-t-3xl"
    style={{
      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.blueAccent} 100%)`,
    }}
  >
    <div className="backdrop-blur-xl bg-white/10 p-4 flex items-center gap-4 border-b border-white/20">
      <button
        onClick={onBack}
        className="p-2 hover:bg-white/20 rounded-full transition-all active:scale-95"
        aria-label="Go back"
      >
        <ArrowLeft size={20} className="text-white" />
      </button>
      
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="relative flex-shrink-0">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${colors.greenAccent} 0%, ${colors.secondary} 100%)`,
            }}
          >
            {counterpart?.displayName?.[0]?.toUpperCase() || 'N'}
          </div>
          {isOnline && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"
            />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-lg truncate">
            {counterpart?.displayName || 'New Chat'}
          </h3>
          <p className="text-white/70 text-sm">
            {isOnline ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>

      <div className="flex gap-2 flex-shrink-0">
        <button 
          className="p-2 hover:bg-white/20 rounded-full transition-all active:scale-95"
          aria-label="Voice call"
        >
          <Phone size={20} className="text-white" />
        </button>
        <button 
          className="p-2 hover:bg-white/20 rounded-full transition-all active:scale-95"
          aria-label="Video call"
        >
          <Video size={20} className="text-white" />
        </button>
        <button 
          className="p-2 hover:bg-white/20 rounded-full transition-all active:scale-95"
          aria-label="More options"
        >
          <MoreVertical size={20} className="text-white" />
        </button>
      </div>
    </div>
  </motion.div>
));

// MessageBubble Component with Timestamp on Hover
const MessageBubble = React.memo(({ message, isOwn, showAvatar }) => {
  const [showTimestamp, setShowTimestamp] = useState(false);
  
  const time = useMemo(() => {
    try {
      return new Date(message.createdAt).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  }, [message.createdAt]);

  const fullTimestamp = useMemo(() => {
    try {
      return new Date(message.createdAt).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  }, [message.createdAt]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4 group`}
      onMouseEnter={() => setShowTimestamp(true)}
      onMouseLeave={() => setShowTimestamp(false)}
    >
      <div className="relative max-w-[70%] sm:max-w-[60%]">
        {/* Timestamp on hover */}
        <AnimatePresence>
          {showTimestamp && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className={`absolute ${isOwn ? 'right-0' : 'left-0'} -top-6 text-white/40 text-xs`}
            >
              {fullTimestamp}
            </motion.div>
          )}
        </AnimatePresence>

        <div
          className={`rounded-2xl p-4 shadow-lg backdrop-blur-xl ${
            isOwn ? 'rounded-br-sm' : 'rounded-bl-sm'
          }`}
          style={{
            background: isOwn
              ? `linear-gradient(135deg, ${colors.primary} 0%, ${colors.blueAccent} 100%)`
              : `linear-gradient(135deg, ${colors.grey.dark} 0%, #1f1f2e 100%)`,
          }}
        >
          <p className="text-white text-sm leading-relaxed mb-2 break-words">{message.text}</p>
          <div className="flex items-center gap-1 justify-end">
            <span className="text-white/60 text-xs">{time}</span>
            {isOwn && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-white/60"
              >
                {message.isRead ? (
                  <CheckCheck size={14} className="text-green-400" />
                ) : (
                  <Check size={14} />
                )}
              </motion.span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

// TypingIndicator Component
const TypingIndicator = React.memo(() => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 10 }}
    className="flex justify-start mb-4"
  >
    <div
      className="rounded-2xl rounded-bl-sm p-4 backdrop-blur-xl shadow-lg"
      style={{
        background: `linear-gradient(135deg, ${colors.grey.dark} 0%, #1f1f2e 100%)`,
      }}
    >
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -5, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
            }}
            className="w-2 h-2 rounded-full bg-white/60"
          />
        ))}
      </div>
    </div>
  </motion.div>
));

// Emoji Picker Component (Simple)
const EmojiPicker = React.memo(({ onSelect, onClose }) => {
  const emojis = ['😊', '😂', '❤️', '👍', '🎉', '🔥', '✨', '💯', '🙏', '👋', '😎', '🤔', '😍', '🥳', '💪'];
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      className="absolute bottom-full left-0 mb-2 p-3 rounded-2xl shadow-2xl backdrop-blur-xl z-50"
      style={{
        background: `linear-gradient(135deg, ${colors.background.paper} 0%, #1a1f35 100%)`,
      }}
    >
      <div className="grid grid-cols-5 gap-2">
        {emojis.map((emoji) => (
          <button
            key={emoji}
            onClick={() => {
              onSelect(emoji);
              onClose();
            }}
            className="text-2xl hover:scale-125 transition-transform active:scale-95"
          >
            {emoji}
          </button>
        ))}
      </div>
    </motion.div>
  );
});

// MessageInput Component
const MessageInput = React.memo(({ onSend, onTyping, disabled }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const typingTimeoutRef = useRef(null);

  const handleChange = useCallback((e) => {
    setMessage(e.target.value);
    
    if (onTyping) {
      onTyping();
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {}, 1000);
    }
  }, [onTyping]);

  const handleSubmit = useCallback(() => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
      setShowEmojiPicker(false);
    }
  }, [message, disabled, onSend]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }, [handleSubmit]);

  const handleEmojiSelect = useCallback((emoji) => {
    setMessage((prev) => prev + emoji);
  }, []);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="relative overflow-visible rounded-b-3xl"
      style={{
        background: `linear-gradient(135deg, ${colors.background.paper} 0%, #1a1f35 100%)`,
      }}
    >
      <div className="backdrop-blur-xl bg-white/5 p-4 flex items-center gap-3 border-t border-white/10">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 hover:bg-white/10 rounded-full transition-all flex-shrink-0 active:scale-95"
            style={{ color: colors.yellowAccent }}
            aria-label="Add emoji"
          >
            <Smile size={22} />
          </button>
          
          <AnimatePresence>
            {showEmojiPicker && (
              <EmojiPicker 
                onSelect={handleEmojiSelect} 
                onClose={() => setShowEmojiPicker(false)} 
              />
            )}
          </AnimatePresence>
        </div>

        <button
          type="button"
          className="p-2 hover:bg-white/10 rounded-full transition-all flex-shrink-0 active:scale-95"
          style={{ color: colors.greenAccent }}
          aria-label="Attach file"
        >
          <Paperclip size={22} />
        </button>

        <input
          type="text"
          value={message}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          placeholder="Type a message..."
          className="flex-1 bg-white/10 text-white placeholder-white/50 px-4 py-3 rounded-full border border-white/20 focus:border-white/40 focus:outline-none transition-all"
        />

        <motion.button
          onClick={handleSubmit}
          disabled={!message.trim() || disabled}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 rounded-full shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          style={{
            background: message.trim()
              ? `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.greenAccent} 100%)`
              : colors.grey.dark,
          }}
          aria-label="Send message"
        >
          <Send size={20} className="text-white" />
        </motion.button>
      </div>
    </motion.div>
  );
});

// ==================== MAIN COMPONENT ====================

const ChatRoom = ({ receiverId, receiverType = 'User', listingId = null, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [counterpart, setCounterpart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [typing, setTyping] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [showReconnectBanner, setShowReconnectBanner] = useState(false);
  
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const messageContainerRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  const token = useMemo(() => localStorage.getItem('token'), []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const markMessagesAsRead = useCallback(async () => {
    if (!token || !receiverId) return;

    try {
      await fetch(`${API_BASE}/chat/mark-read/${receiverId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (err) {
      console.warn('Failed to mark messages as read:', err);
    }
  }, [token, receiverId]);

  const fetchConversation = useCallback(async () => {
    if (!token) {
      setError('Authentication required. Please login.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const url = listingId
        ? `${API_BASE}/chat/${receiverId}?listingId=${listingId}`
        : `${API_BASE}/chat/${receiverId}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setMessages(data.messages || []);
        setCounterpart(data.counterpart);
        setCurrentUserId(data.me);
        setError(null);
        
        await markMessagesAsRead();
      } else {
        throw new Error(data.message || 'Failed to load conversation');
      }
    } catch (err) {
      console.error('❌ Failed to fetch conversation:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, receiverId, listingId, markMessagesAsRead]);

  const handleSendMessage = useCallback(async (messageText) => {
    if (!token || !messageText.trim()) return;

    const tempId = `temp-${Date.now()}`;
    const optimisticMessage = {
      id: tempId,
      from: 'me',
      text: messageText,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMessage]);

    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiver: receiverId,
          receiverType,
          message: messageText,
          listingId: listingId || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempId
              ? {
                  id: data.chatMessage._id,
                  from: 'me',
                  text: messageText,
                  isRead: false,
                  createdAt: data.chatMessage.created_at,
                }
              : msg
          )
        );
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error('❌ Failed to send message:', err);
      setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
      setError('Failed to send message. Please try again.');
      setTimeout(() => setError(null), 3000);
    }
  }, [token, receiverId, receiverType, listingId]);

  const handleTyping = useCallback(() => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('typing', { receiverId });
    }
  }, [receiverId]);

  useEffect(() => {
    if (!token) {
      setError('Authentication required. Please login.');
      setLoading(false);
      return;
    }

    fetchConversation();

    socketRef.current = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketRef.current.on('connect', () => {
      console.log('✅ Socket connected');
      setSocketConnected(true);
      setIsOnline(true);
      setShowReconnectBanner(false);
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    });

    socketRef.current.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      setSocketConnected(false);
      setIsOnline(false);
      setShowReconnectBanner(true);
    });

    socketRef.current.on('connect_error', (err) => {
      console.error('❌ Socket connection error:', err);
      setSocketConnected(false);
      setShowReconnectBanner(true);
    });

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      socketRef.current?.disconnect();
    };
  }, [token, fetchConversation]);

  useEffect(() => {
    if (!socketRef.current || !currentUserId || !socketConnected) return;

    socketRef.current.emit('join_room', { userId: currentUserId, receiverId });

    socketRef.current.on('new_message', (message) => {
      const senderId = message.sender?.id || message.sender?._id;
      const receiverIdMsg = message.receiver?.id || message.receiver?._id;
      
      if (
        (senderId === receiverId || receiverIdMsg === receiverId) &&
        (senderId === currentUserId || receiverIdMsg === currentUserId)
      ) {
        const newMessage = {
          id: message._id,
          from: senderId?.toString() === currentUserId?.toString() ? 'me' : 'them',
          text: message.message,
          isRead: message.isRead || false,
          createdAt: message.created_at || new Date().toISOString(),
        };

        setMessages((prev) => {
          if (prev.some((m) => m.id === newMessage.id)) {
            return prev;
          }
          return [...prev, newMessage];
        });

        if (newMessage.from === 'them') {
          markMessagesAsRead();
        }
      }
    });

    socketRef.current.on('typing', ({ userId }) => {
      if (userId === receiverId || userId?.toString() === receiverId?.toString()) {
        setTyping(true);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => setTyping(false), 3000);
      }
    });

    socketRef.current.on('user_online', ({ userId }) => {
      if (userId === receiverId || userId?.toString() === receiverId?.toString()) {
        setIsOnline(true);
      }
    });

    socketRef.current.on('user_offline', ({ userId }) => {
      if (userId === receiverId || userId?.toString() === receiverId?.toString()) {
        setIsOnline(false);
      }
    });

    return () => {
      socketRef.current?.off('new_message');
      socketRef.current?.off('typing');
      socketRef.current?.off('user_online');
      socketRef.current?.off('user_offline');
    };
  }, [currentUserId, receiverId, markMessagesAsRead]);

  const groupedMessages = useMemo(() => groupMessagesByDate(messages), [messages]);

  // Always render the chat UI
  return (
    <div
      className="h-screen flex flex-col"
      style={{
        background: `radial-gradient(ellipse at top, ${colors.background.paper} 0%, ${colors.background.dark} 100%)`,
      }}
    >
      <ChatHeader counterpart={counterpart} onBack={onBack} isOnline={isOnline} />

      <AnimatePresence>
        {showReconnectBanner && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mx-4 mt-4 p-3 rounded-lg text-white text-sm flex items-center gap-2"
            style={{ background: colors.yellowAccent }}
          >
            <WifiOff size={16} />
            <span>Reconnecting to server...</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-4 mt-4 p-3 rounded-lg text-white text-sm text-center"
            style={{ background: colors.redAccent }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div 
        ref={messageContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-2 scroll-smooth"
      >
        {loading && !counterpart ? (
          <MessageSkeleton />
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <div className="text-6xl mb-4">👋</div>
              <p className="text-gray-400 text-lg">No messages yet</p>
              <p className="text-gray-500 text-sm mt-2">Start the conversation!</p>
            </motion.div>
          </div>
        ) : (
          <AnimatePresence>
            {Object.entries(groupedMessages).map(([date, msgs]) => (
              <div key={date}>
                <DateDivider date={msgs[0].createdAt} />
                {msgs.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} isOwn={msg.from === 'me'} />
                ))}
              </div>
            ))}
            {typing && <TypingIndicator />}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput onSend={handleSendMessage} onTyping={handleTyping} disabled={!socketConnected} />
    </div>
  );
};

export default ChatRoom;