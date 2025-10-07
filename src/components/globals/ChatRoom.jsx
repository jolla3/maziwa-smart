import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Smile, 
  Paperclip, 
  Phone, 
  Video, 
  MoreVertical, 
  Search,
  Check, 
  CheckCheck,
  WifiOff,
  X,
  Menu
} from 'lucide-react';
import io from 'socket.io-client';

const API_BASE = 'https://maziwasmart.onrender.com/api';
const SOCKET_URL = 'https://maziwasmart.onrender.com';

// ==================== UTILITY FUNCTIONS ====================

const formatDateDivider = (date) => {
  const today = new Date();
  const msgDate = new Date(date);
  const diffDays = Math.floor((today - msgDate) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return msgDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const groupMessagesByDate = (messages) => {
  const groups = {};
  messages.forEach((msg) => {
    const date = new Date(msg.createdAt).toDateString();
    if (!groups[date]) groups[date] = [];
    groups[date].push(msg);
  });
  return groups;
};

// ==================== SIDEBAR COMPONENT ====================

const Sidebar = ({ contacts, activeContact, onSelectContact, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = useMemo(() => {
    return contacts.filter(contact =>
      contact.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [contacts, searchQuery]);

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      className="h-full flex flex-col bg-gradient-to-br from-[#0b0f19] to-[#1a1f35] border-r border-white/10"
    >
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Messages</h2>
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-white/10 rounded-full transition-all"
          >
            <X size={20} className="text-white" />
          </button>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contacts..."
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-[#4cceac] focus:outline-none transition-all focus:shadow-[0_0_20px_rgba(76,206,172,0.3)]"
          />
        </div>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto">
        {filteredContacts.map((contact) => (
          <motion.div
            key={contact.id}
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectContact(contact)}
            className={`p-4 cursor-pointer transition-all relative group ${
              activeContact?.id === contact.id
                ? 'bg-gradient-to-r from-[#6870fa]/20 to-[#4cceac]/20 border-l-4 border-[#4cceac]'
                : 'hover:bg-white/5'
            }`}
          >
            {/* Ripple effect */}
            <motion.div
              className="absolute inset-0 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100"
              initial={false}
              animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
              transition={{ duration: 0.6 }}
            />

            <div className="flex gap-3 relative z-10">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6870fa] to-[#4cceac] flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {contact.displayName?.[0]?.toUpperCase() || 'U'}
                </div>
                {contact.isOnline && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-[#0b0f19]"
                  />
                )}
                {contact.unreadCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-[#db4f4a] rounded-full flex items-center justify-center text-white text-xs font-bold"
                  >
                    {contact.unreadCount}
                  </motion.div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-white font-semibold truncate">
                    {contact.displayName || 'Unknown'}
                  </h3>
                  <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                    {contact.lastMessageTime}
                  </span>
                </div>
                <p className="text-sm text-gray-400 truncate">
                  {contact.lastMessage || 'No messages yet'}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// ==================== CHAT AREA COMPONENT ====================

const DateDivider = ({ date }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex justify-center my-6"
  >
    <div className="px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-xl text-white/60 text-xs font-medium shadow-lg">
      {formatDateDivider(date)}
    </div>
  </motion.div>
);

const MessageBubble = ({ message, isOwn }) => {
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
        <AnimatePresence>
          {showTimestamp && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className={`absolute ${isOwn ? 'right-0' : 'left-0'} -top-6 text-white/40 text-xs font-medium`}
            >
              {time}
            </motion.div>
          )}
        </AnimatePresence>

        <div
          className={`rounded-2xl p-4 shadow-2xl backdrop-blur-xl border border-white/10 ${
            isOwn ? 'rounded-br-sm' : 'rounded-bl-sm'
          }`}
          style={{
            background: isOwn
              ? 'linear-gradient(135deg, #4cceac 0%, #70d8bd 100%)'
              : 'linear-gradient(135deg, #2e2e2e 0%, #3a3a4a 100%)',
            boxShadow: isOwn
              ? '0 8px 32px rgba(76, 206, 172, 0.3)'
              : '0 8px 32px rgba(0, 0, 0, 0.3)',
          }}
        >
          <p className="text-white text-sm leading-relaxed break-words">{message.text}</p>
          <div className="flex items-center gap-1 justify-end mt-1">
            {isOwn && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-white/80"
              >
                {message.isRead ? (
                  <CheckCheck size={14} className="text-white" />
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
};

const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 10 }}
    className="flex justify-start mb-4"
  >
    <div
      className="rounded-2xl rounded-bl-sm p-4 backdrop-blur-xl shadow-2xl border border-white/10"
      style={{
        background: 'linear-gradient(135deg, #2e2e2e 0%, #3a3a4a 100%)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(76, 206, 172, 0.1)',
      }}
    >
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
            }}
            className="w-2 h-2 rounded-full bg-[#4cceac]"
            style={{ boxShadow: '0 0 10px rgba(76, 206, 172, 0.5)' }}
          />
        ))}
      </div>
    </div>
  </motion.div>
);

const EmojiPicker = ({ onSelect, onClose }) => {
  const emojis = ['😊', '😂', '❤️', '👍', '🎉', '🔥', '✨', '💯', '🙏', '👋', '😎', '🤔', '😍', '🥳', '💪'];
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      className="absolute bottom-full left-0 mb-2 p-4 rounded-2xl shadow-2xl backdrop-blur-xl z-50 border border-white/20"
      style={{
        background: 'linear-gradient(135deg, #1a1f35 0%, #2a2f45 100%)',
      }}
    >
      <div className="grid grid-cols-5 gap-2">
        {emojis.map((emoji) => (
          <motion.button
            key={emoji}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              onSelect(emoji);
              onClose();
            }}
            className="text-2xl p-2 hover:bg-white/10 rounded-lg transition-all"
          >
            {emoji}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

const ChatArea = ({ 
  contact, 
  messages, 
  typing, 
  loading, 
  onSendMessage, 
  onTyping,
  socketConnected,
  onOpenSidebar 
}) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleChange = (e) => {
    setMessage(e.target.value);
    
    if (onTyping) {
      onTyping();
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {}, 1000);
    }
  };

  const handleSubmit = () => {
    if (message.trim() && !loading) {
      onSendMessage(message.trim());
      setMessage('');
      setShowEmojiPicker(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const groupedMessages = useMemo(() => groupMessagesByDate(messages), [messages]);

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* Parallax Background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-[#0b0f19] via-[#1a1f35] to-[#0b0f19] opacity-90"
        style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(104, 112, 250, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(76, 206, 172, 0.1) 0%, transparent 50%)',
        }}
      />

      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 backdrop-blur-xl bg-white/5 border-b border-white/10 p-4 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSidebar}
              className="lg:hidden p-2 hover:bg-white/10 rounded-full transition-all"
            >
              <Menu size={20} className="text-white" />
            </button>
            
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6870fa] to-[#4cceac] flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {contact?.displayName?.[0]?.toUpperCase() || 'U'}
              </div>
              {contact?.isOnline && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-[#0b0f19]"
                />
              )}
            </div>
            
            <div>
              <h3 className="text-white font-semibold text-lg">
                {contact?.displayName || 'Select a contact'}
              </h3>
              <p className="text-sm text-gray-400">
                {typing ? (
                  <span className="flex items-center gap-1">
                    typing
                    <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1, repeat: Infinity }}>
                      ...
                    </motion.span>
                  </span>
                ) : contact?.isOnline ? (
                  'Online'
                ) : (
                  'Offline'
                )}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 hover:bg-white/10 rounded-full transition-all"
            >
              <Phone size={20} className="text-white" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 hover:bg-white/10 rounded-full transition-all"
            >
              <Video size={20} className="text-white" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 hover:bg-white/10 rounded-full transition-all"
            >
              <MoreVertical size={20} className="text-white" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-2 scroll-smooth relative z-10">
        {messages.length === 0 ? (
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

      {/* Input Area */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 backdrop-blur-xl bg-white/5 border-t border-white/10 p-4"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-3 hover:bg-white/10 rounded-full transition-all"
            >
              <Smile size={22} className="text-[#ffe14a]" />
            </motion.button>
            
            <AnimatePresence>
              {showEmojiPicker && (
                <EmojiPicker 
                  onSelect={(emoji) => setMessage(message + emoji)} 
                  onClose={() => setShowEmojiPicker(false)} 
                />
              )}
            </AnimatePresence>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-3 hover:bg-white/10 rounded-full transition-all"
          >
            <Paperclip size={22} className="text-[#4cceac]" />
          </motion.button>

          <input
            type="text"
            value={message}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            disabled={!socketConnected}
            placeholder="Type a message..."
            className="flex-1 bg-white/10 text-white placeholder-gray-400 px-6 py-3 rounded-full border border-white/10 focus:border-[#4cceac] focus:outline-none transition-all focus:shadow-[0_0_20px_rgba(76,206,172,0.3)]"
          />

          <motion.button
            onClick={handleSubmit}
            disabled={!message.trim() || !socketConnected}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-full shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: message.trim()
                ? 'linear-gradient(135deg, #4cceac 0%, #70d8bd 100%)'
                : 'linear-gradient(135deg, #2e2e2e 0%, #3a3a4a 100%)',
              boxShadow: message.trim()
                ? '0 0 30px rgba(76, 206, 172, 0.6)'
                : 'none',
            }}
          >
            <Send size={20} className="text-white" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

// ==================== MAIN CHATROOM COMPONENT ====================

const ChatRoom = () => {
  const [contacts, setContacts] = useState([
    {
      id: '1',
      displayName: 'John Farmer',
      lastMessage: 'The milk delivery is ready',
      lastMessageTime: '2m',
      isOnline: true,
      unreadCount: 2,
    },
    {
      id: '2',
      displayName: 'Sarah Producer',
      lastMessage: 'Thanks for the order!',
      lastMessageTime: '1h',
      isOnline: false,
      unreadCount: 0,
    },
    {
      id: '3',
      displayName: 'Mike Porter',
      lastMessage: 'On my way',
      lastMessageTime: '3h',
      isOnline: true,
      unreadCount: 1,
    },
  ]);

  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [socketConnected, setSocketConnected] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showReconnectToast, setShowReconnectToast] = useState(false);

  const socketRef = useRef(null);
  const token = useMemo(() => localStorage.getItem('token'), []);

  const handleSendMessage = useCallback((messageText) => {
    const newMessage = {
      id: `temp-${Date.now()}`,
      from: 'me',
      text: messageText,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const handleTyping = useCallback(() => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('typing', { receiverId: activeContact?.id });
    }
  }, [activeContact]);

  const handleSelectContact = useCallback((contact) => {
    setActiveContact(contact);
    setMessages([
      {
        id: '1',
        from: 'them',
        text: 'Hello! How can I help you?',
        isRead: true,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: '2',
        from: 'me',
        text: 'I need some information about milk delivery',
        isRead: true,
        createdAt: new Date(Date.now() - 3500000).toISOString(),
      },
      {
        id: '3',
        from: 'them',
        text: 'Sure! What would you like to know?',
        isRead: true,
        createdAt: new Date(Date.now() - 60000).toISOString(),
      },
    ]);
    if (window.innerWidth < 1024) {
      setShowSidebar(false);
    }
  }, []);

  return (
    <div className="h-screen flex overflow-hidden bg-[#0b0f19]">
      {/* Reconnect Toast */}
      <AnimatePresence>
        {showReconnectToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full backdrop-blur-xl shadow-2xl border border-white/20 flex items-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #ffe14a 0%, #ffb347 100%)',
            }}
          >
            <WifiOff size={18} className="text-white" />
            <span className="text-white font-medium">Reconnecting...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 right-6 z-50 px-6 py-3 rounded-xl backdrop-blur-xl shadow-2xl border border-white/20"
            style={{
              background: 'linear-gradient(135deg, #db4f4a 0%, #ff6b6b 100%)',
            }}
          >
            <span className="text-white font-medium">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div className={`${showSidebar ? 'w-full lg:w-[30%]' : 'hidden'} lg:block transition-all`}>
        <Sidebar
          contacts={contacts}
          activeContact={activeContact}
          onSelectContact={handleSelectContact}
          onClose={() => setShowSidebar(false)}
        />
      </div>

      {/* Chat Area */}
      <div className={`${showSidebar ? 'hidden lg:block' : 'block'} flex-1`}>
        {activeContact ? (
          <ChatArea
            contact={activeContact}
            messages={messages}
            typing={typing}
            loading={loading}
            onSendMessage={handleSendMessage}
            onTyping={handleTyping}
            socketConnected={socketConnected}
            onOpenSidebar={() => setShowSidebar(true)}
          />
        ) : (
          <div className="h-full flex items-center justify-center bg-gradient-to-br from-[#0b0f19] to-[#1a1f35]">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <div className="text-6xl mb-4">💬</div>
              <p className="text-gray-400 text-xl">Select a contact to start chatting</p>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatRoom;