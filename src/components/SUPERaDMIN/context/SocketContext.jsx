// ============================================
// src/superadmin/context/SocketContext.jsx
// ============================================
import React, { createContext, useContext } from 'react';
import { useAdminSocket } from './../hook/useAdminSocket';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socketData = useAdminSocket();

  return (
    <SocketContext.Provider value={socketData}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};
