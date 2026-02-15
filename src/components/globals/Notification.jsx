import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Container,
  Card,
  CardContent,
  Button,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Badge,
  Avatar,
  Typography,
  Divider,
  alpha,
} from '@mui/material';
import { Bell, Check, CheckCheck, Trash2, Filter, AlertCircle, Info, Calendar, ArrowLeft } from 'lucide-react';
import { AuthContext } from '../PrivateComponents/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApiCache } from '../../hooks/useApiCache';

const Notifications = () => {
  const { token, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  // CUSTOM AQUA COLORS - NO GREY ANYWHERE
  const customColors = {
    background: '#e0f7fa',           // Light cyan/aqua background
    cardBackground: '#ffffff',        // Pure white
    text: '#000000',                 // Pure black text
    textSecondary: '#006064',        // Dark cyan
    textLight: '#00838f',            // Medium cyan
    primary: '#00bcd4',              // Bright aqua/cyan
    primaryHover: '#00acc1',         // Darker cyan
    success: '#00e676',              // Bright green
    successHover: '#00c853',         // Darker green
    error: '#ff1744',                // Bright red
    errorHover: '#d50000',           // Darker red
    border: '#80deea',               // Light cyan border
    borderDark: '#4dd0e1',           // Medium cyan border
    searchBg: '#b2ebf2',             // Light cyan for search
    shadow: 'rgba(0, 188, 212, 0.2)', // Aqua shadow
  };

  const [filterType, setFilterType] = useState('all');
  const [filterRead, setFilterRead] = useState('all');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [highlightId, setHighlightId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [notifications, setNotifications] = useState([]);  // Local state for immediate updates

  const API_URL = process.env.REACT_APP_API_BASE;

  const showToastMessage = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Define fetch function for cache with better error handling
  const fetchNotificationsData = async () => {
    let url = `${API_URL}/notifications?`;
    if (filterType !== 'all') url += `type=${filterType}&`;
    if (filterRead !== 'all') url += `is_read=${filterRead === 'read'}&`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        logout();
        throw new Error('Unauthorized. Please log in again.');
      }
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    const result = await response.json();
    if (!result.success || !result.data) {
      throw new Error('Invalid API response');
    }

    // Update local state and save to localStorage for Topbar
    setNotifications(result.data);
    localStorage.setItem('notifications', JSON.stringify({
      data: result.data,
      timestamp: Date.now()
    }));

    // Trigger custom event so Topbar updates
    window.dispatchEvent(new Event('notificationCacheUpdated'));

    return result.data;
  };

  // Use cache hook with dependencies for filters
  const { loading, error, clearCache } = useApiCache(
    'notifications',
    fetchNotificationsData,
    [filterType, filterRead, token]
  );

  // Sync local state with cache on initial load
  useEffect(() => {
    const cached = JSON.parse(localStorage.getItem('notifications'));
    if (cached && cached.data) {
      setNotifications(cached.data);
    }
  }, []);

  // Handle scroll to highlighted notification
  useEffect(() => {
    if (notifications && !loading) {
      const selectedId = location.state?.selectedId;
      if (selectedId && notifications.some(n => n._id === selectedId)) {
        setHighlightId(selectedId);
        setTimeout(() => {
          document.getElementById(`notif-${selectedId}`)?.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }, 100);
      }
    }
  }, [notifications, loading, location.state?.selectedId]);

  // Handle errors
  useEffect(() => {
    if (error) {
      showToastMessage(error, 'error');
    }
  }, [error]);

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
        // Update local state immediately for instant UI feedback
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, is_read: true } : n));
        // Update localStorage
        const updated = notifications.map(n => n._id === id ? { ...n, is_read: true } : n);
        localStorage.setItem('notifications', JSON.stringify({
          data: updated,
          timestamp: Date.now()
        }));
        window.dispatchEvent(new Event('notificationCacheUpdated'));
        showToastMessage('Marked as read', 'success');
      } else {
        throw new Error('Failed to mark as read');
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
        // Update local state immediately
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        // Update localStorage
        const updated = notifications.map(n => ({ ...n, is_read: true }));
        localStorage.setItem('notifications', JSON.stringify({
          data: updated,
          timestamp: Date.now()
        }));
        window.dispatchEvent(new Event('notificationCacheUpdated'));
        showToastMessage('All notifications marked as read', 'success');
      } else {
        throw new Error('Failed to mark all as read');
      }
    } catch (error) {
      showToastMessage('Failed to mark all as read', 'error');
    }
  };

  const deleteNotification = async (id) => {
    setDeletingId(id);
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
        // Update local state immediately
        setNotifications(prev => prev.filter(n => n._id !== id));
        // Update localStorage
        const updated = notifications.filter(n => n._id !== id);
        localStorage.setItem('notifications', JSON.stringify({
          data: updated,
          timestamp: Date.now()
        }));
        window.dispatchEvent(new Event('notificationCacheUpdated'));
        showToastMessage('Notification deleted', 'success');
      } else {
        throw new Error('Failed to delete notification');
      }
    } catch (error) {
      showToastMessage('Failed to delete notification', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const unreadCount = notifications?.filter(n => !n.is_read).length || 0;

  const getNotificationIcon = (type) => {
    const iconProps = { size: 28, style: { width: 28, height: 28 } };
    switch (type) {
      case 'alert': return <AlertCircle {...iconProps} style={{ ...iconProps.style, color: customColors.error }} />;
      case 'info': return <Info {...iconProps} style={{ ...iconProps.style, color: customColors.primary }} />;
      case 'reminder': return <Calendar {...iconProps} style={{ ...iconProps.style, color: customColors.success }} />;
      default: return <Bell {...iconProps} style={{ ...iconProps.style, color: customColors.success }} />;
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  if (loading && notifications.length === 0) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        backgroundColor={customColors.background}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <Bell size={48} style={{ color: customColors.success }} />
        </motion.div>
      </Box>
    );
  }

  return (
    <Box minHeight="100vh" backgroundColor={customColors.background} py={4}>
      <Container maxWidth="md">
        {/* Toast Notification */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ type: 'spring', damping: 15 }}
              style={{
                position: 'fixed',
                top: 20,
                right: 20,
                zIndex: 9999,
              }}
            >
              <Card
                sx={{
                  backgroundColor: toastType === 'success' ? customColors.success : customColors.error,
                  color: '#fff',
                  boxShadow: `0 8px 24px ${customColors.shadow}`,
                }}
              >
                <CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  {toastType === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
                  <Typography fontWeight={600}>{toastMessage}</Typography>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box mb={4}>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button
                  startIcon={<ArrowLeft size={20} />}
                  onClick={() => navigate(-1)}
                  variant="outlined"
                  sx={{
                    borderColor: customColors.border,
                    color: customColors.text,
                    '&:hover': {
                      backgroundColor: alpha(customColors.success, 0.1),
                      borderColor: customColors.success,
                    },
                  }}
                >
                  Back
                </Button>
              </motion.div>
              <Box>
                <Box display="flex" alignItems="center" gap={2}>
                  <Bell size={32} style={{ color: customColors.success }} />
                  <Typography variant="h3" fontWeight={800} color={customColors.text}>
                    Notifications
                  </Typography>
                </Box>
                <Box mt={1}>
                  {unreadCount > 0 ? (
                    <Chip
                      label={`${unreadCount} unread`}
                      sx={{
                        backgroundColor: customColors.error,
                        color: '#fff',
                        fontWeight: 700,
                      }}
                    />
                  ) : (
                    <Typography variant="body2" sx={{ color: customColors.success, fontWeight: 600 }}>
                      ✓ All caught up!
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>

            {/* Mark All as Read Button */}
            {unreadCount > 0 && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="contained"
                  onClick={markAllAsRead}
                  startIcon={<CheckCheck size={18} />}
                  sx={{
                    backgroundColor: customColors.success,
                    color: '#fff',
                    fontWeight: 700,
                    '&:hover': {
                      backgroundColor: customColors.successHover,
                    },
                  }}
                >
                  Mark All Read
                </Button>
              </motion.div>
            )}
          </Box>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ marginBottom: '2rem' }}
        >
          <Card
            sx={{
              backgroundColor: customColors.cardBackground,
              border: `1px solid ${customColors.border}`,
              boxShadow: `0 4px 12px ${customColors.shadow}`,
            }}
          >
            <CardContent>
              <Box display="flex" gap={3} flexDirection={{ xs: 'column', md: 'row' }}>
                <Box flex={1}>
                  <FormControl fullWidth size="small">
                    <InputLabel
                      sx={{
                        color: customColors.text,
                        '&.Mui-focused': { color: customColors.success },
                      }}
                    >
                      Filter by Type
                    </InputLabel>
                    <Select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      label="Filter by Type"
                      sx={{
                        backgroundColor: customColors.searchBg,
                        color: customColors.text,
                        border: `1px solid ${customColors.border}`,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: customColors.border,
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: customColors.success,
                        },
                      }}
                    >
                      <MenuItem value="all">All Types</MenuItem>
                      <MenuItem value="alert">🚨 Alerts</MenuItem>
                      <MenuItem value="info">ℹ️ Info</MenuItem>
                      <MenuItem value="reminder">📅 Reminders</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Box flex={1}>
                  <FormControl fullWidth size="small">
                    <InputLabel
                      sx={{
                        color: customColors.text,
                        '&.Mui-focused': { color: customColors.success },
                      }}
                    >
                      Filter by Status
                    </InputLabel>
                    <Select
                      value={filterRead}
                      onChange={(e) => setFilterRead(e.target.value)}
                      label="Filter by Status"
                      sx={{
                        backgroundColor: customColors.searchBg,
                        color: customColors.text,
                        border: `1px solid ${customColors.border}`,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: customColors.border,
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: customColors.success,
                        },
                      }}
                    >
                      <MenuItem value="all">All Status</MenuItem>
                      <MenuItem value="unread">⭕ Unread</MenuItem>
                      <MenuItem value="read">✓ Read</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {!notifications || notifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card
                sx={{
                  backgroundColor: customColors.cardBackground,
                  textAlign: 'center',
                  py: 6,
                  border: `2px dashed ${customColors.border}`,
                }}
              >
                <CardContent>
                  <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                    <Bell size={64} style={{ color: alpha(customColors.primary, 0.3), marginBottom: '1rem' }} />
                  </motion.div>
                  <Typography variant="h5" fontWeight={700} color={customColors.text} mb={1}>
                    {loading ? 'Loading notifications...' : 'No notifications found'}
                  </Typography>
                  <Typography variant="body2" color={customColors.textSecondary}>
                    {loading ? 'Please wait.' : "You're all caught up! Check back later for new notifications."}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              {notifications.map((notification, index) => (
                <motion.div
                  key={notification._id}
                  id={`notif-${notification._id}`}
                  initial={{ opacity: 0, x: -20, height: 'auto' }}
                  animate={{ opacity: 1, x: 0, height: 'auto' }}
                  exit={{ opacity: 0, x: 100, height: 0 }}
                  transition={{ duration: 0.3 }}
                  layout
                  style={{ marginBottom: '1rem' }}
                >
                  <motion.div
                    whileHover={{ scale: 1.02, boxShadow: `0 12px 32px ${alpha(customColors.success, 0.2)}` }}
                    transition={{ type: 'spring', damping: 15 }}
                  >
                    <Card
                      sx={{
                        backgroundColor: customColors.cardBackground,
                        border: `2px solid ${!notification.is_read ? customColors.success : customColors.border}`,
                        boxShadow: highlightId === notification._id ? `0 0 0 4px ${alpha(customColors.primary, 0.3)}` : `0 4px 12px ${customColors.shadow}`,
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      {!notification.is_read && (
                        <motion.div
                          layoutId="highlight"
                          style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: '4px',
                            backgroundColor: customColors.success,
                          }}
                        />
                      )}

                      <CardContent>
                        <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: 'auto 1fr auto' }} gap={2} alignItems="flex-start">
                          {/* Icon */}
                          <motion.div
                            whileHover={{ rotate: 15, scale: 1.1 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                          >
                            {getNotificationIcon(notification.type)}
                          </motion.div>

                          {/* Content */}
                          <Box flex={1}>
                            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                              <Box display="flex" alignItems="center" gap={1.5}>
                                <Typography variant="h6" fontWeight={700} color={customColors.text}>
                                  {notification.title}
                                </Typography>
                                {!notification.is_read && (
                                  <motion.div whileHover={{ scale: 1.1 }}>
                                    <Chip
                                      label="New"
                                      size="small"
                                      sx={{
                                        backgroundColor: customColors.error,
                                        color: '#fff',
                                        fontWeight: 700,
                                        height: 24,
                                      }}
                                    />
                                  </motion.div>
                                )}
                              </Box>
                              <Typography variant="caption" color={customColors.textLight} fontWeight={600} sx={{ whiteSpace: 'nowrap' }}>
                                {formatDate(notification.created_at)}
                              </Typography>
                            </Box>
                            <Typography variant="body2" color={customColors.textSecondary} mb={1.5}>
                              {notification.message}
                            </Typography>
                            {notification.cow && (
                              <motion.div whileHover={{ scale: 1.05 }}>
                                <Chip
                                  label={`🐄 ${notification.cow.cow_name || notification.cow.animal_code}`}
                                  size="small"
                                  sx={{
                                    backgroundColor: alpha(customColors.primary, 0.2),
                                    color: customColors.primary,
                                    fontWeight: 600,
                                  }}
                                />
                              </motion.div>
                            )}
                          </Box>

                          {/* Actions */}
                          <Box display="flex" gap={1}>
                            {!notification.is_read && (
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                  size="small"
                                  variant="contained"
                                  onClick={() => markAsRead(notification._id)}
                                  sx={{
                                    backgroundColor: customColors.success,
                                    color: '#fff',
                                    minWidth: 'auto',
                                    p: 1,
                                    '&:hover': {
                                      backgroundColor: customColors.successHover,
                                    },
                                  }}
                                >
                                  <Check size={18} />
                                </Button>
                              </motion.div>
                            )}
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                size="small"
                                variant="outlined"
                                disabled={deletingId === notification._id}
                                onClick={() => deleteNotification(notification._id)}
                                sx={{
                                  borderColor: customColors.error,
                                  color: customColors.error,
                                  minWidth: 'auto',
                                  p: 1,
                                  '&:hover': {
                                    backgroundColor: alpha(customColors.error, 0.1),
                                  },
                                }}
                              >
                                <Trash2 size={18} />
                              </Button>
                            </motion.div>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </motion.div>
      </Container>
    </Box>
  );
};

export default Notifications;