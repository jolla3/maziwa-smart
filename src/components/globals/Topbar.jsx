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
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ColorModeContext, tokens } from "../../theme";
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

const Topbar = ({ onSearch, onSettingsClick, onProfileAction }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const { user, logout, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [searchValue, setSearchValue] = useState("");
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [profileAnchor, setProfileAnchor] = useState(null);
  const [settingsAnchor, setSettingsAnchor] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pulseNotification, setPulseNotification] = useState(false);

  const API_URL = process.env.REACT_APP_API_BASE;

  const fetchNotifications = async () => {
    if (!token) return;
    
    try {
      const response = await fetch(`${API_URL}/notifications?is_read=false`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const result = await response.json();
        const newCount = result.count;
        
        // Trigger pulse animation when new notifications arrive
        if (newCount > unreadCount) {
          setPulseNotification(true);
          setTimeout(() => setPulseNotification(false), 1500);
        }
        
        setNotifications(result.data.slice(0, 5));
        setUnreadCount(newCount);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [token]);

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
    <Box display="flex" alignItems="center" gap={0.5}>
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        <Tooltip title="Toggle theme">
          <IconButton 
            onClick={colorMode.toggleColorMode} 
            sx={{ 
              color: colors.grey[100],
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: alpha(colors.greenAccent[500], 0.1),
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
            onClick={(e) => setNotificationAnchor(e.currentTarget)}
            sx={{ 
              color: colors.grey[100],
              position: 'relative',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: alpha(colors.blueAccent[500], 0.1),
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
            onClick={(e) => setSettingsAnchor(e.currentTarget)}
            sx={{ 
              color: colors.grey[100],
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: alpha(colors.blueAccent[500], 0.1),
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
            onClick={(e) => setProfileAnchor(e.currentTarget)}
            sx={{ 
              color: colors.grey[100],
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
          p={2}
          sx={{
            backgroundColor: colors.primary[400],
            boxShadow: `0 2px 8px ${alpha(colors.grey[900], 0.1)}`,
          }}
        >
          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            style={{ flex: 1 }}
          >
            <Box
              display="flex"
              backgroundColor={alpha(colors.grey[700], 0.3)}
              borderRadius="8px"
              minWidth={isMobile ? "200px" : "300px"}
              maxWidth={isMobile ? "250px" : "400px"}
              border={`2px solid ${colors.grey[700]}`}
              transition="all 0.3s ease"
              sx={{
                '&:hover': {
                  backgroundColor: alpha(colors.greenAccent[500], 0.1),
                  borderColor: colors.greenAccent[500],
                },
                '&:focus-within': {
                  backgroundColor: alpha(colors.greenAccent[500], 0.15),
                  borderColor: colors.greenAccent[500],
                  boxShadow: `0 0 0 3px ${alpha(colors.greenAccent[500], 0.1)}`,
                },
              }}
            >
              <InputBase 
                sx={{ 
                  ml: 2, 
                  flex: 1, 
                  color: colors.grey[100],
                  '& input::placeholder': {
                    color: alpha(colors.grey[100], 0.5),
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
                  sx={{ p: 1, color: colors.greenAccent[500] }} 
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
            style={{ marginLeft: '1rem' }}
          >
            {isMobile ? (
              <Box display="flex" alignItems="center">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <IconButton 
                    onClick={colorMode.toggleColorMode} 
                    sx={{ color: colors.grey[100] }}
                  >
                    {theme.palette.mode === "dark" ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
                  </IconButton>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <IconButton 
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                    sx={{ color: colors.grey[100] }}
                  >
                    {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                  </IconButton>
                </motion.div>
              </Box>
            ) : (
              <DesktopIcons />
            )}
          </motion.div>
        </Box>
      </motion.div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobile && mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box 
              p={2} 
              backgroundColor={colors.primary[400]} 
              borderTop={`1px solid ${colors.grey[700]}`}
            >
              <Box display="flex" flexDirection="column" gap={2}>
                <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
                  <Box 
                    display="flex" 
                    alignItems="center" 
                    gap={2} 
                    onClick={(e) => setNotificationAnchor(e.currentTarget)}
                    sx={{ cursor: 'pointer', p: 1, borderRadius: 1, transition: 'all 0.3s ease', '&:hover': { backgroundColor: alpha(colors.blueAccent[500], 0.1) } }}
                  >
                    <IconButton sx={{ color: colors.grey[100] }}>
                      <Badge badgeContent={unreadCount} color="error">
                        <NotificationsOutlinedIcon />
                      </Badge>
                    </IconButton>
                    <Typography color={colors.grey[100]}>Notifications</Typography>
                  </Box>
                </motion.div>
              </Box>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NOTIFICATIONS MENU */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={() => setNotificationAnchor(null)}
        TransitionComponent={motion.div}
        PaperProps={{
          sx: {
            backgroundColor: colors.primary[400],
            color: colors.grey[100],
            minWidth: 320,
            maxHeight: 450,
            boxShadow: `0 8px 32px ${alpha(colors.grey[900], 0.2)}`,
            border: `1px solid ${colors.grey[700]}`,
          }
        }}
      >
        <MenuItem disabled sx={{ backgroundColor: colors.primary[400] }}>
          <Typography variant="h6" fontWeight="bold">
            Notifications {unreadCount > 0 && `(${unreadCount})`}
          </Typography>
        </MenuItem>
        <Divider sx={{ backgroundColor: colors.grey[700] }} />
        
        {notifications.length === 0 ? (
          <MenuItem disabled>
            <Typography variant="body2" color={colors.grey[300]}>No new notifications</Typography>
          </MenuItem>
        ) : (
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
                  backgroundColor: colors.blueAccent[800],
                  '&:hover': { 
                    backgroundColor: colors.blueAccent[700],
                    transform: 'translateX(4px)',
                  },
                  py: 1.5,
                  borderBottom: `1px solid ${colors.grey[700]}`,
                  transition: 'all 0.2s ease',
                }}
              >
                <Box width="100%">
                  <Box display="flex" justifyContent="space-between" mb={0.5}>
                    <Typography variant="body2" fontWeight="bold">{notif.title}</Typography>
                    <Typography variant="caption" color={colors.grey[400]}>{formatDate(notif.created_at)}</Typography>
                  </Box>
                  <Typography variant="caption" color={colors.grey[300]}>
                    {notif.message?.substring(0, 60)}{notif.message?.length > 60 ? '...' : ''}
                  </Typography>
                </Box>
              </MenuItem>
            </motion.div>
          ))
        )}
        
        <Divider sx={{ backgroundColor: colors.grey[700] }} />
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <MenuItem 
            onClick={() => {
              setNotificationAnchor(null);
              navigate('/notifications');
            }}
            sx={{ 
              justifyContent: 'center', 
              color: colors.greenAccent[400], 
              fontWeight: 'bold',
              py: 1.5,
              transition: 'all 0.2s ease',
            }}
          >
            View All Notifications
          </MenuItem>
        </motion.div>
      </Menu>

      {/* PROFILE MENU */}
      <Menu
        anchorEl={profileAnchor}
        open={Boolean(profileAnchor)}
        onClose={() => setProfileAnchor(null)}
        PaperProps={{ 
          sx: { 
            backgroundColor: colors.primary[400], 
            color: colors.grey[100], 
            minWidth: 200,
            boxShadow: `0 8px 32px ${alpha(colors.grey[900], 0.2)}`,
            border: `1px solid ${colors.grey[700]}`,
          } 
        }}
      >
        {user && (
          <MenuItem disabled sx={{ backgroundColor: colors.primary[400] }}>
            <motion.div whileHover={{ scale: 1.05 }} style={{ width: '100%' }}>
              <Box display="flex" alignItems="center" gap={2}>
                {user.avatar ? <Avatar src={user.avatar} alt={user.name} sx={{ width: 32, height: 32 }} /> : <PersonOutlinedIcon />}
                <Box>
                  <Typography variant="body2">{user.name || 'User'}</Typography>
                  <Typography variant="caption" color={colors.grey[300]}>{user.email || 'user@example.com'}</Typography>
                </Box>
              </Box>
            </motion.div>
          </MenuItem>
        )}
        <Divider sx={{ backgroundColor: colors.grey[700] }} />
        <motion.div whileHover={{ x: 5 }}>
          <MenuItem 
            onClick={() => { setProfileAnchor(null); onProfileAction?.('view-profile'); }}
            sx={{ transition: 'all 0.2s ease', '&:hover': { backgroundColor: alpha(colors.greenAccent[500], 0.1) } }}
          >
            <PersonOutlinedIcon sx={{ mr: 2 }} />View Profile
          </MenuItem>
        </motion.div>
        <motion.div whileHover={{ x: 5 }}>
          <MenuItem 
            onClick={() => { setProfileAnchor(null); onProfileAction?.('account-settings'); }}
            sx={{ transition: 'all 0.2s ease', '&:hover': { backgroundColor: alpha(colors.greenAccent[500], 0.1) } }}
          >
            <SettingsOutlinedIcon sx={{ mr: 2 }} />Account Settings
          </MenuItem>
        </motion.div>
        <Divider sx={{ backgroundColor: colors.grey[700] }} />
        <motion.div whileHover={{ x: 5 }}>
          <MenuItem 
            onClick={() => { setProfileAnchor(null); logout(); }} 
            sx={{ 
              color: colors.redAccent[400],
              transition: 'all 0.2s ease',
              '&:hover': { backgroundColor: alpha(colors.redAccent[500], 0.1) }
            }}
          >
            <LogoutIcon sx={{ mr: 2 }} />Logout
          </MenuItem>
        </motion.div>
      </Menu>

      {/* SETTINGS MENU */}
      <Menu
        anchorEl={settingsAnchor}
        open={Boolean(settingsAnchor)}
        onClose={() => setSettingsAnchor(null)}
        PaperProps={{ 
          sx: { 
            backgroundColor: colors.primary[400], 
            color: colors.grey[100], 
            minWidth: 200,
            boxShadow: `0 8px 32px ${alpha(colors.grey[900], 0.2)}`,
            border: `1px solid ${colors.grey[700]}`,
          } 
        }}
      >
        <motion.div whileHover={{ x: 5 }}>
          <MenuItem 
            onClick={() => { setSettingsAnchor(null); onSettingsClick?.('general'); }}
            sx={{ transition: 'all 0.2s ease', '&:hover': { backgroundColor: alpha(colors.blueAccent[500], 0.1) } }}
          >
            General Settings
          </MenuItem>
        </motion.div>
        <motion.div whileHover={{ x: 5 }}>
          <MenuItem 
            onClick={() => { setSettingsAnchor(null); onSettingsClick?.('privacy'); }}
            sx={{ transition: 'all 0.2s ease', '&:hover': { backgroundColor: alpha(colors.blueAccent[500], 0.1) } }}
          >
            Privacy Settings
          </MenuItem>
        </motion.div>
        <motion.div whileHover={{ x: 5 }}>
          <MenuItem 
            onClick={() => { setSettingsAnchor(null); onSettingsClick?.('notifications'); }}
            sx={{ transition: 'all 0.2s ease', '&:hover': { backgroundColor: alpha(colors.blueAccent[500], 0.1) } }}
          >
            Notification Settings
          </MenuItem>
        </motion.div>
        <Divider sx={{ backgroundColor: colors.grey[700] }} />
        <motion.div whileHover={{ x: 5 }}>
          <MenuItem 
            onClick={() => { setSettingsAnchor(null); onSettingsClick?.('help'); }}
            sx={{ transition: 'all 0.2s ease', '&:hover': { backgroundColor: alpha(colors.blueAccent[500], 0.1) } }}
          >
            Help & Support
          </MenuItem>
        </motion.div>
      </Menu>
    </Box>
  );
};

export default Topbar;