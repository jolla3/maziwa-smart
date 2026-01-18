export { default } from './ChatRoom';
export { default as ChatRoom } from './ChatRoom';

// Export components if needed elsewhere
export { Header } from './components/Header';
export { MessageBubble } from './components/MessageBubble';
export { MessageList } from './components/MessageList';
export { InputArea } from './components/InputArea';
export { EmojiPickerWrapper } from './components/EmojiPickerWrapper';
export { UserProfileModal } from './components/UserProfileModal';
export { ConnectionModal } from './components/ConnectionModal';

// Export hooks if needed elsewhere
export { useChatMessages } from './hooks/useChatMessages';
export { useSocket } from './hooks/useSocket';
export { useTyping } from './hooks/useTyping';
export { useUserStatus } from './hooks/useUserStatus';
export { useCallHandler } from './hooks/useCallHandler';

// Export utilities
export * from './utils/phone';
export * from './utils/time';
export * from './utils/device';