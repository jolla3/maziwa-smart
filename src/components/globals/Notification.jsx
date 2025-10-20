// src/pages/Notifications.jsx
import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, CheckCheck, Trash2, Filter, AlertCircle, Info, Calendar, ArrowLeft } from 'lucide-react';
import { AuthContext } from '../PrivateComponents/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

const Notifications = () => {
  const { token } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [filterRead, setFilterRead] = useState('all');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [highlightId, setHighlightId] = useState(null);

  const API_URL =  'https://maziwasmart.onrender.com/api';

  const showToastMessage = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      
      let url = `${API_URL}/notifications?`;
      if (filterType !== 'all') url += `type=${filterType}&`;
      if (filterRead !== 'all') url += `is_read=${filterRead === 'read'}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch');

      const result = await response.json();
      if (result.success) {
        setNotifications(result.data);
        
        // Scroll to highlighted notification from topbar click
        const selectedId = location.state?.selectedId;
        if (selectedId) {
          setHighlightId(selectedId);
          setTimeout(() => {
            document.getElementById(`notif-${selectedId}`)?.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
          }, 100);
        }
      }
      setLoading(false);
    } catch (error) {
      showToastMessage('Failed to load notifications', 'error');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchNotifications();
  }, [token, filterType, filterRead]);

  const markAsRead = async (id) => {
    try {
      const response = await fetch(`${API_URL}/notifications/read/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      if (result.success) {
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, is_read: true } : n));
      } else {
        showToastMessage(result.message || 'Failed to mark as read', 'error');
      }
    } catch (error) {
      showToastMessage('Failed to mark as read', 'error');
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch(`${API_URL}/notifications/mark-all`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      if (result.success) {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        showToastMessage('All notifications marked as read', 'success');
      } else {
        showToastMessage(result.message || 'Failed to mark all as read', 'error');
      }
    } catch (error) {
      showToastMessage('Failed to mark all as read', 'error');
    }
  };

  const deleteNotification = async (id) => {
    try {
      const response = await fetch(`${API_URL}/notifications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      if (result.success) {
        setNotifications(prev => prev.filter(n => n._id !== id));
        showToastMessage('Notification deleted', 'success');
      } else {
        showToastMessage(result.message || 'Failed to delete notification', 'error');
      }
    } catch (error) {
      showToastMessage('Failed to delete notification', 'error');
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'alert': return <AlertCircle className="text-danger" size={24} />;
      case 'info': return <Info className="text-primary" size={24} />;
      case 'reminder': return <Calendar className="text-warning" size={24} />;
      default: return <Bell className="text-info" size={24} />;
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const diff = Math.floor((Date.now() - d) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return d.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="container-fluid px-3 py-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-3 py-4" style={{ maxWidth: '1200px' }}>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="position-fixed top-0 start-50 translate-middle-x mt-3"
            style={{ zIndex: 9999 }}
          >
            <div className={`alert alert-${toastType === 'success' ? 'success' : 'danger'} shadow-lg border-0`}>
              <strong>{toastMessage}</strong>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header with Back Button */}
      <div className="row mb-4">
        <div className="col-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="d-flex justify-content-between align-items-center flex-wrap gap-3"
          >
            <div className="d-flex align-items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-outline-secondary"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft size={20} className="me-2" />
                Back
              </motion.button>
              <div>
                <h2 className="fw-bold mb-1 text-dark d-flex align-items-center">
                  <Bell className="me-2" size={32} style={{ color: '#0d6efd' }} />
                  Notifications
                </h2>
                <p className="text-muted mb-0">
                  {unreadCount > 0 ? (
                    <span className="badge bg-primary rounded-pill">{unreadCount} unread</span>
                  ) : (
                    <span className="text-success">✓ All caught up!</span>
                  )}
                </p>
              </div>
            </div>
            {unreadCount > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-primary shadow-sm"
                onClick={markAllAsRead}
              >
                <CheckCheck size={18} className="me-2" />
                Mark All Read
              </motion.button>
            )}
          </motion.div>
        </div>
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-12">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold d-flex align-items-center">
                    <Filter size={18} className="me-2 text-primary" />
                    Filter by Type
                  </label>
                  <select className="form-select shadow-sm border-0" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                    <option value="all">All Types</option>
                    <option value="alert">🚨 Alerts</option>
                    <option value="info">ℹ️ Info</option>
                    <option value="reminder">📅 Reminders</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Filter by Status</label>
                  <select className="form-select shadow-sm border-0" value={filterRead} onChange={(e) => setFilterRead(e.target.value)}>
                    <option value="all">All Status</option>
                    <option value="unread">⭕ Unread</option>
                    <option value="read">✓ Read</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="row">
        <div className="col-12">
          {notifications.length === 0 ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-5">
              <Bell size={64} className="text-muted mb-3" style={{ opacity: 0.3 }} />
              <h4 className="text-muted">No notifications found</h4>
              <p className="text-muted">You're all caught up!</p>
            </motion.div>
          ) : (
            <AnimatePresence>
              {notifications.map((notification, index) => (
                <motion.div
                  key={notification._id}
                  id={`notif-${notification._id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100, height: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
                  className="mb-3"
                >
                  <div 
                    className={`card border-0 shadow-sm ${!notification.is_read ? 'border-start border-primary border-4 bg-light' : ''} ${highlightId === notification._id ? 'border-warning border-3' : ''}`}
                    style={{ transition: 'all 0.3s ease' }}
                  >
                    <div className="card-body p-4">
                      <div className="row align-items-center">
                        <div className="col-auto">
                          <motion.div whileHover={{ rotate: 15 }} transition={{ type: 'spring', stiffness: 300 }}>
                            {getNotificationIcon(notification.type)}
                          </motion.div>
                        </div>
                        <div className="col">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h5 className="mb-1 fw-bold text-dark">
                              {notification.title}
                              {!notification.is_read && <span className="badge bg-primary ms-2 rounded-pill">New</span>}
                            </h5>
                            <small className="text-muted fw-semibold">{formatDate(notification.created_at)}</small>
                          </div>
                          <p className="mb-2 text-secondary">{notification.message}</p>
                          {notification.cow && (
                            <span className="badge bg-info text-dark px-3 py-2">
                              🐄 {notification.cow.cow_name || notification.cow.animal_code}
                            </span>
                          )}
                        </div>
                        <div className="col-auto">
                          <div className="d-flex gap-2">
                            {!notification.is_read && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="btn btn-sm btn-success shadow-sm"
                                onClick={() => markAsRead(notification._id)}
                              >
                                <Check size={18} />
                              </motion.button>
                            )}
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="btn btn-sm btn-danger shadow-sm"
                              onClick={() => deleteNotification(notification._id)}
                            >
                              <Trash2 size={18} />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;