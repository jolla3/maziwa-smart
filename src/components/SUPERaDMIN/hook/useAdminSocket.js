// ============================================
// FILE: /src/superadmin/hooks/useAdminSocket.js
// ============================================
import { useEffect, useState, useCallback, useContext } from 'react';
import io from 'socket.io-client';
import { AuthContext } from '../../PrivateComponents/AuthContext';

const API_BASE = process.env.REACT_APP_API_BASE 

export const useAdminSocket = () => {
  const { token } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (!token) return;

    const socketInstance = io(API_BASE, {
      auth: { token },
      transports: ['websocket', 'polling']
    });

    socketInstance.on('connect', () => {
      setIsConnected(true);
      addActivity('System', 'Connected to monitoring service');
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
      addActivity('System', 'Disconnected from monitoring service');
    });

    socketInstance.on('monitor:onlineUsers', (data) => {
      setOnlineUsers(data.users || []);
    });

    socketInstance.on('alert:new', (alert) => {
      addActivity('Alert', `New ${alert.severity} alert: ${alert.type}`);
    });

    socketInstance.on('admin:notify', (notification) => {
      addActivity('Notification', notification.message || notification);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.close();
    };
  }, [token]);

  const addActivity = useCallback((type, message) => {
    setActivities(prev => [{
      type,
      message,
      timestamp: new Date().toISOString()
    }, ...prev.slice(0, 49)]);
  }, []);

  const emit = useCallback((event, data) => {
    if (socket && isConnected) {
      socket.emit(event, data);
    }
  }, [socket, isConnected]);

  return { 
    socket, 
    isConnected, 
    onlineUsers, 
    activities,
    emit
  };
};