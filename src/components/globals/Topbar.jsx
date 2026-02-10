import { 
  Box, 
  IconButton, 
  useTheme, 
  Menu, 
  MenuItem, 
  Badge, 
  Avatar, 
  Typography, 
  Divider,
  useMediaQuery,
  Collapse,
  Tooltip,
  alpha
} from "@mui/material";
import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ColorModeContext } from "../../theme";
import { AuthContext } from "../../components/PrivateComponents/AuthContext";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const Topbar = ({ onSearch, onSettingsClick }) => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
  // CUSTOM AQUA COLORS - NO GREY ANYWHERE
  const customColors = {
    background: '#e0f7fa',
    cardBackground: '#ffffff',
    text: '#000000',
    textSecondary: '#006064',
    textLight: '#00838f',
    primary: '#00bcd4',
    primaryHover: '#00acc1',
    success: '#00e676',
    successHover: '#00c853',
    error: '#ff1744',
    errorHover: '#d50000',
    border: '#80deea',
    borderDark: '#4dd0e1',
    searchBg: '#b2ebf2',
    shadow: 'rgba(0, 188, 212, 0.2)',
  };
  
  const [searchValue, setSearchValue] = useState("");
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [profileAnchor, setProfileAnchor] = useState(null);
  const [settingsAnchor, setSettingsAnchor] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pulseNotification, setPulseNotification] = useState(false);

  // Refs for IconButtons to fix anchorEl issues
  const notificationButtonRef = useRef(null);
  const profileButtonRef = useRef(null);
  const settingsButtonRef = useRef(null);

  // Helper to read from shared cache with error handling
  const readFromCache = () => {
    try {
      const cache = JSON.parse(localStorage.getItem('notifications'));
      if (cache && cache.data) {
        const unread = cache.data.filter(n => !n.is_read);
        setNotifications(cache.data.slice(0, 5));
        setUnreadCount(unread.length);
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (err) {
      console.warn("Failed to read notifications cache:", err);
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  // Read cache on mount and listen for updates
  useEffect(() => {
    readFromCache();
    const handleStorageChange = () => readFromCache();
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom event in case of same-tab updates
    const handleCacheUpdate = () => readFromCache();
    window.addEventListener('notificationCacheUpdated', handleCacheUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('notificationCacheUpdated', handleCacheUpdate);
    };
  }, []);

  // Pulse for new notifications
  useEffect(() => {
    if (unreadCount > 0) {
      setPulseNotification(true);
      setTimeout(() => setPulseNotification(false), 1500);
    }
  }, [unreadCount]);

  const handleSearch = () => {
    if (searchValue.trim() && onSearch) {
      onSearch(searchValue.trim());
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const diff = Math.floor((Date.now() - d) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return d.toLocaleDateString();
  };

  const DesktopIcons = () => (
    <Box display="flex" alignItems="center" gap={0.5} flexWrap="wrap">
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        <Tooltip title="Toggle theme">
          <IconButton 
            onClick={colorMode.toggleColorMode} 
            sx={{ 
              color: customColors.text,
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: alpha(customColors.success, 0.1),
                transform: 'rotate(20deg)',
              }
            }}
          >
            {theme.palette.mode === "dark" ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
          </IconButton>
        </Tooltip>
      </motion.div>

      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        <Tooltip title="Notifications">
          <IconButton 
            ref={notificationButtonRef}
            onClick={(e) => {
              if (notificationButtonRef.current) {
                setNotificationAnchor(e.currentTarget);
              }
            }}
            sx={{ 
              color: customColors.text,
              position: 'relative',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: alpha(customColors.primary, 0.1),
              }
            }}
          >
            <motion.div
              animate={pulseNotification ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.6 }}
            >
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsOutlinedIcon />
              </Badge>
            </motion.div>
          </IconButton>
        </Tooltip>
      </motion.div>

      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        <Tooltip title="Settings">
          <IconButton 
            ref={settingsButtonRef}
            onClick={(e) => {
              if (settingsButtonRef.current) {
                setSettingsAnchor(e.currentTarget);
              }
            }}
            sx={{ 
              color: customColors.text,
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: alpha(customColors.primary, 0.1),
                transform: 'rotate(-20deg)',
              }
            }}
          >
            <SettingsOutlinedIcon />
          </IconButton>
        </Tooltip>
      </motion.div>

      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        <Tooltip title="Profile">
          <IconButton 
            ref={profileButtonRef}
            onClick={(e) => {
              if (profileButtonRef.current) {
                setProfileAnchor(e.currentTarget);
              }
            }}
            sx={{ 
              color: customColors.text,
              transition: 'all 0.3s ease',
            }}
          >
            {user?.avatar ? (
              <motion.div whileHover={{ rotate: 10 }}>
                <Avatar src={user.avatar} alt={user.name} sx={{ width: 32, height: 32 }} />
              </motion.div>
            ) : (
              <PersonOutlinedIcon />
            )}
          </IconButton>
        </Tooltip>
      </motion.div>
    </Box>
  );

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Box 
          display="flex" 
          justifyContent="space-between" 
          alignItems="center" 
          p={isSmallScreen ? 0.25 : 1}  // Reduced padding on small screens to eliminate white space
          sx={{
            backgroundColor: customColors.background,
            boxShadow: `0 2px 8px ${customColors.shadow}`,
            flexWrap: 'wrap',
          }}
        >
          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            style={{ flex: 1, minWidth: isMobile ? '150px' : '200px' }}
          >
            <Box
              display="flex"
              backgroundColor={customColors.searchBg}
              borderRadius="8px"
              minWidth={isMobile ? "150px" : "300px"}
              maxWidth={isMobile ? "200px" : "400px"}
              border={`2px solid ${customColors.border}`}
              transition="all 0.3s ease"
              sx={{
                '&:hover': {
                  backgroundColor: alpha(customColors.success, 0.1),
                  borderColor: customColors.success,
                },
                '&:focus-within': {
                  backgroundColor: alpha(customColors.success, 0.15),
                  borderColor: customColors.success,
                  boxShadow: `0 0 0 3px ${alpha(customColors.success, 0.1)}`,
                },
              }}
            >
              <InputBase 
                sx={{ 
                  ml: 2, 
                  flex: 1, 
                  color: customColors.text,
                  '& input::placeholder': {
                    color: customColors.textSecondary,
                    opacity: 1,
                  }
                }} 
                placeholder="Search..." 
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyPress={handleSearchKeyPress}
              />
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <IconButton 
                  sx={{ p: 1, color: customColors.success }} 
                  onClick={handleSearch}
                >
                  <SearchIcon />
                </IconButton>
              </motion.div>
            </Box>
          </motion.div>

          {/* Icons */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            style={{ marginLeft: isMobile ? '0.5rem' : '1rem' }}
          >
            {isMobile ? (
              <Box display="flex" alignItems="center" gap={0.5}>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <IconButton 
                    onClick={colorMode.toggleColorMode} 
                    sx={{ color: customColors.text }}
                  >
                    {theme.palette.mode === "dark" ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
                  </IconButton>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Badge badgeContent={unreadCount} color="error">  {/* Badge on hamburger for count visibility */}
                    <IconButton 
                      onClick={() => {
                        const newOpen = !mobileMenuOpen;
                        setMobileMenuOpen(newOpen);
                        // Close all menus when closing mobile menu to prevent invalid anchorEl
                        if (!newOpen) {
                          setNotificationAnchor(null);
                          setProfileAnchor(null);
                          setSettingsAnchor(null);
                        }
                      }} 
                      sx={{ color: customColors.text }}
                    >
                      {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                    </IconButton>
                  </Badge>
                </motion.div>
              </Box>
            ) : (
              <DesktopIcons />
            )}
          </motion.div>
        </Box>
      </motion.div>

      {/* MOBILE MENU - Added zIndex to prevent collisions */}
      <AnimatePresence>
        {isMobile && mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{ zIndex: 1000, position: 'relative' }}  // High zIndex to avoid overlapping content
          >
            <Box 
              p={1}  // Reduced padding for compactness
              backgroundColor={customColors.background}
              borderTop={`1px solid ${customColors.border}`}
            >
              <Box display="flex" flexDirection="column" gap={1}>  // Reduced gap
                <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
                  <Box 
                    display="flex" 
                    alignItems="center" 
                    gap={2} 
                    onClick={(e) => setNotificationAnchor(e.currentTarget)}
                    sx={{ cursor: 'pointer', p: 1, borderRadius: 1, transition: 'all 0.3s ease', '&:hover': { backgroundColor: alpha(customColors.primary, 0.1) } }}
                  >
                    <IconButton sx={{ color: customColors.text }}>
                      <Badge badgeContent={unreadCount} color="error">
                        <NotificationsOutlinedIcon />
                      </Badge>
                    </IconButton>
                    <Typography color={customColors.text}>Notifications</Typography>
                  </Box>
                </motion.div>
                <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
                  <Box 
                    display="flex" 
                    alignItems="center" 
                    gap={2} 
                    onClick={(e) => setProfileAnchor(e.currentTarget)}
                    sx={{ cursor: 'pointer', p: 1, borderRadius: 1, transition: 'all 0.3s ease', '&:hover': { backgroundColor: alpha(customColors.success, 0.1) } }}
                  >
                    <IconButton sx={{ color: customColors.text }}>
                      {user?.avatar ? <Avatar src={user.avatar} alt={user.name} sx={{ width: 24, height: 24 }} /> : <PersonOutlinedIcon />}
                    </IconButton>
                    <Typography color={customColors.text}>Profile</Typography>
                  </Box>
                </motion.div>
                                <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
                  <Box 
                    display="flex" 
                    alignItems="center" 
                    gap={2} 
                    onClick={(e) => setSettingsAnchor(e.currentTarget)}
                    sx={{ cursor: 'pointer', p: 1, borderRadius: 1, transition: 'all 0.3s ease', '&:hover': { backgroundColor: alpha(customColors.primary, 0.1) } }}
                  >
                    <IconButton sx={{ color: customColors.text }}>
                      <SettingsOutlinedIcon />
                    </IconButton>
                    <Typography color={customColors.text}>Settings</Typography>
                  </Box>
                </motion.div>
              </Box>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NOTIFICATIONS MENU - Fixed Fragment and removed TransitionComponent */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={() => setNotificationAnchor(null)}
        PaperProps={{
          sx: {
            backgroundColor: customColors.cardBackground,
            color: customColors.text,
            minWidth: isSmallScreen ? 280 : 320,
            maxHeight: 450,
            boxShadow: `0 8px 32px ${customColors.shadow}`,
            border: `1px solid ${customColors.border}`,
          }
        }}
      >
        <MenuItem disabled sx={{ backgroundColor: customColors.cardBackground }}>
          <Typography variant="h6" fontWeight="bold">
            Notifications {unreadCount > 0 && `(${unreadCount})`}
          </Typography>
        </MenuItem>
        <Divider sx={{ backgroundColor: customColors.border }} />
        
        {notifications.length === 0 ? [
          <MenuItem key="no-notifications" disabled>
            <Typography variant="body2" color={customColors.textSecondary}>No notifications cached yet.</Typography>
          </MenuItem>,
          <motion.div key="load-button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <MenuItem 
              onClick={() => {
                setNotificationAnchor(null);
                navigate('/notifications');
              }}
              sx={{ 
                justifyContent: 'center', 
                color: customColors.success, 
                fontWeight: 'bold',
                py: 1.5,
                transition: 'all 0.2s ease',
              }}
            >
              Load Notifications
            </MenuItem>
          </motion.div>
        ] : (
          notifications.map((notif, index) => (
            <motion.div
              key={notif._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <MenuItem 
                onClick={() => {
                  setNotificationAnchor(null);
                  navigate('/notifications', { state: { selectedId: notif._id } });
                }}
                sx={{
                  backgroundColor: alpha(customColors.primary, 0.05),
                  '&:hover': { 
                    backgroundColor: alpha(customColors.primary, 0.15),
                    transform: 'translateX(4px)',
                  },
                  py: 1.5,
                  borderBottom: `1px solid ${customColors.border}`,
                  transition: 'all 0.2s ease',
                }}
              >
                <Box width="100%">
                  <Box display="flex" justifyContent="space-between" mb={0.5}>
                    <Typography variant="body2" fontWeight="bold" color={customColors.text}>{notif.title}</Typography>
                    <Typography variant="caption" color={customColors.textLight}>{formatDate(notif.created_at)}</Typography>
                  </Box>
                  <Typography variant="caption" color={customColors.textSecondary}>
                    {notif.message?.substring(0, 60)}{notif.message?.length > 60 ? '...' : ''}
                  </Typography>
                </Box>
              </MenuItem>
            </motion.div>
          ))
        )}
        
        <Divider sx={{ backgroundColor: customColors.border }} />
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <MenuItem 
            onClick={() => {
              setNotificationAnchor(null);
              navigate('/notifications');
            }}
            sx={{ 
              justifyContent: 'center', 
              color: customColors.success, 
              fontWeight: 'bold',
              py: 1.5,
              transition: 'all 0.2s ease',
            }}
          >
            View All Notifications
          </MenuItem>
        </motion.div>
      </Menu>

      {/* PROFILE MENU - Made responsive */}
      <Menu
        anchorEl={profileAnchor}
        open={Boolean(profileAnchor)}
        onClose={() => setProfileAnchor(null)}
        PaperProps={{ 
          sx: { 
            backgroundColor: customColors.cardBackground, 
            color: customColors.text, 
            minWidth: isSmallScreen ? 180 : 200,
            boxShadow: `0 8px 32px ${customColors.shadow}`,
            border: `1px solid ${customColors.border}`,
          } 
        }}
      >
        {user && (
          <MenuItem disabled sx={{ backgroundColor: customColors.cardBackground }}>
            <motion.div whileHover={{ scale: 1.05 }} style={{ width: '100%' }}>
              <Box display="flex" alignItems="center" gap={2}>
                {user.avatar ? <Avatar src={user.avatar} alt={user.name} sx={{ width: 32, height: 32 }} /> : <PersonOutlinedIcon />}
                <Box>
                  <Typography variant="body2" color={customColors.text}>{user.name || 'User'}</Typography>
                  <Typography variant="caption" color={customColors.textSecondary}>{user.email || 'user@example.com'}</Typography>
                </Box>
              </Box>
            </motion.div>
          </MenuItem>
        )}
        <Divider sx={{ backgroundColor: customColors.border }} />
        <motion.div whileHover={{ x: 5 }}>
          <MenuItem 
            onClick={() => { setProfileAnchor(null); navigate('/profile'); }}
            sx={{ transition: 'all 0.2s ease', '&:hover': { backgroundColor: alpha(customColors.success, 0.1) } }}
          >
            <PersonOutlinedIcon sx={{ mr: 2 }} />View Profile
          </MenuItem>
        </motion.div>
        <motion.div whileHover={{ x: 5 }}>
          <MenuItem 
            onClick={() => { setProfileAnchor(null); navigate('/profile'); }}
            sx={{ transition: 'all 0.2s ease', '&:hover': { backgroundColor: alpha(customColors.success, 0.1) } }}
          >
            <SettingsOutlinedIcon sx={{ mr: 2 }} />Account Settings
          </MenuItem>
        </motion.div>
        <Divider sx={{ backgroundColor: customColors.border }} />
        <motion.div whileHover={{ x: 5 }}>
          <MenuItem 
            onClick={() => { setProfileAnchor(null); logout(); }} 
            sx={{ 
              color: customColors.error,
              transition: 'all 0.2s ease',
              '&:hover': { backgroundColor: alpha(customColors.error, 0.1) }
            }}
          >
            <LogoutIcon sx={{ mr: 2 }} />Logout
          </MenuItem>
        </motion.div>
      </Menu>

      {/* SETTINGS MENU - Made responsive */}
      <Menu
        anchorEl={settingsAnchor}
        open={Boolean(settingsAnchor)}
        onClose={() => setSettingsAnchor(null)}
        PaperProps={{ 
          sx: { 
            backgroundColor: customColors.cardBackground, 
            color: customColors.text, 
            minWidth: isSmallScreen ? 180 : 200,
            boxShadow: `0 8px 32px ${customColors.shadow}`,
            border: `1px solid ${customColors.border}`,
          } 
        }}
      >
        <motion.div whileHover={{ x: 5 }}>
          <MenuItem 
            onClick={() => { setSettingsAnchor(null); onSettingsClick?.('general'); }}
            sx={{ transition: 'all 0.2s ease', '&:hover': { backgroundColor: alpha(customColors.primary, 0.1) } }}
          >
            General Settings
          </MenuItem>
        </motion.div>
        <motion.div whileHover={{ x: 5 }}>
          <MenuItem 
            onClick={() => { setSettingsAnchor(null); onSettingsClick?.('privacy'); }}
            sx={{ transition: 'all 0.2s ease', '&:hover': { backgroundColor: alpha(customColors.primary, 0.1) } }}
          >
            Privacy Settings
          </MenuItem>
        </motion.div>
        <motion.div whileHover={{ x: 5 }}>
          <MenuItem 
            onClick={() => { setSettingsAnchor(null); onSettingsClick?.('notifications'); }}
            sx={{ transition: 'all 0.2s ease', '&:hover': { backgroundColor: alpha(customColors.primary, 0.1) } }}
          >
            Notification Settings
          </MenuItem>
        </motion.div>
        <Divider sx={{ backgroundColor: customColors.border }} />
        <motion.div whileHover={{ x: 5 }}>
          <MenuItem 
            onClick={() => { setSettingsAnchor(null); onSettingsClick?.('help'); }}
            sx={{ transition: 'all 0.2s ease', '&:hover': { backgroundColor: alpha(customColors.primary, 0.1) } }}
          >
            Help & Support
          </MenuItem>
        </motion.div>
      </Menu>
    </Box>
  );
};

export default Topbar;