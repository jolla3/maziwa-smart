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
  Tooltip
} from "@mui/material";
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

  const API_URL =      process.env.REACT_APP_API_BASE

  // Fetch only unread count and recent 5 notifications for preview
  const fetchNotifications = async () => {
    if (!token) return;
    
    try {
      const response = await fetch(`${API_URL}/notifications?is_read=false`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const result = await response.json();
        setNotifications(result.data.slice(0, 5));
        setUnreadCount(result.count);
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
    <Box display="flex" alignItems="center" gap={1}>
      <Tooltip title="Toggle theme">
        <IconButton onClick={colorMode.toggleColorMode} sx={{ color: colors.grey[100] }}>
          {theme.palette.mode === "dark" ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
        </IconButton>
      </Tooltip>

      <Tooltip title="Notifications">
        <IconButton onClick={(e) => setNotificationAnchor(e.currentTarget)} sx={{ color: colors.grey[100] }}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsOutlinedIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Tooltip title="Settings">
        <IconButton onClick={(e) => setSettingsAnchor(e.currentTarget)} sx={{ color: colors.grey[100] }}>
          <SettingsOutlinedIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Profile">
        <IconButton onClick={(e) => setProfileAnchor(e.currentTarget)} sx={{ color: colors.grey[100] }}>
          {user?.avatar ? <Avatar src={user.avatar} alt={user.name} sx={{ width: 32, height: 32 }} /> : <PersonOutlinedIcon />}
        </IconButton>
      </Tooltip>
    </Box>
  );

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
        <Box
          display="flex"
          backgroundColor={colors.primary[400]}
          borderRadius="3px"
          minWidth={isMobile ? "200px" : "300px"}
          maxWidth={isMobile ? "250px" : "400px"}
        >
          <InputBase 
            sx={{ ml: 2, flex: 1, color: colors.grey[100] }} 
            placeholder="Search..." 
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyPress={handleSearchKeyPress}
          />
          <IconButton sx={{ p: 1, color: colors.grey[100] }} onClick={handleSearch}>
            <SearchIcon />
          </IconButton>
        </Box>

        {isMobile ? (
          <Box display="flex" alignItems="center">
            <IconButton onClick={colorMode.toggleColorMode} sx={{ color: colors.grey[100] }}>
              {theme.palette.mode === "dark" ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
            </IconButton>
            <IconButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)} sx={{ color: colors.grey[100] }}>
              {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          </Box>
        ) : (
          <DesktopIcons />
        )}
      </Box>

      {/* MOBILE MENU */}
      {isMobile && (
        <Collapse in={mobileMenuOpen}>
          <Box p={2} backgroundColor={colors.primary[400]} borderTop={`1px solid ${colors.grey[700]}`}>
            <Box display="flex" flexDirection="column" gap={2}>
              <Box display="flex" alignItems="center" gap={2} onClick={(e) => setNotificationAnchor(e.currentTarget)}>
                <IconButton sx={{ color: colors.grey[100] }}>
                  <Badge badgeContent={unreadCount} color="error">
                    <NotificationsOutlinedIcon />
                  </Badge>
                </IconButton>
                <Typography color={colors.grey[100]}>Notifications</Typography>
              </Box>
            </Box>
          </Box>
        </Collapse>
      )}

      {/* NOTIFICATIONS MENU */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={() => setNotificationAnchor(null)}
        PaperProps={{
          sx: {
            backgroundColor: colors.primary[400],
            color: colors.grey[100],
            minWidth: 320,
            maxHeight: 450,
          }
        }}
      >
        <MenuItem disabled>
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
          notifications.map((notif) => (
            <MenuItem 
              key={notif._id}
              onClick={() => {
                setNotificationAnchor(null);
                navigate('/notifications', { state: { selectedId: notif._id } });
              }}
              sx={{
                backgroundColor: colors.blueAccent[800],
                '&:hover': { backgroundColor: colors.blueAccent[700] },
                py: 1.5,
                borderBottom: `1px solid ${colors.grey[700]}`
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
          ))
        )}
        
        <Divider sx={{ backgroundColor: colors.grey[700] }} />
        <MenuItem 
          onClick={() => {
            setNotificationAnchor(null);
            navigate('/notifications');
          }}
          sx={{ justifyContent: 'center', color: colors.blueAccent[400], fontWeight: 'bold' }}
        >
          View All Notifications
        </MenuItem>
      </Menu>

      {/* PROFILE MENU */}
      <Menu
        anchorEl={profileAnchor}
        open={Boolean(profileAnchor)}
        onClose={() => setProfileAnchor(null)}
        PaperProps={{ sx: { backgroundColor: colors.primary[400], color: colors.grey[100], minWidth: 200 } }}
      >
        {user && (
          <MenuItem disabled>
            <Box display="flex" alignItems="center" gap={2}>
              {user.avatar ? <Avatar src={user.avatar} alt={user.name} sx={{ width: 32, height: 32 }} /> : <PersonOutlinedIcon />}
              <Box>
                <Typography variant="body2">{user.name || 'User'}</Typography>
                <Typography variant="caption" color={colors.grey[300]}>{user.email || 'user@example.com'}</Typography>
              </Box>
            </Box>
          </MenuItem>
        )}
        <Divider sx={{ backgroundColor: colors.grey[700] }} />
        <MenuItem onClick={() => { setProfileAnchor(null); onProfileAction?.('view-profile'); }}>
          <PersonOutlinedIcon sx={{ mr: 2 }} />View Profile
        </MenuItem>
        <MenuItem onClick={() => { setProfileAnchor(null); onProfileAction?.('account-settings'); }}>
          <SettingsOutlinedIcon sx={{ mr: 2 }} />Account Settings
        </MenuItem>
        <Divider sx={{ backgroundColor: colors.grey[700] }} />
        <MenuItem onClick={() => { setProfileAnchor(null); logout(); }} sx={{ color: colors.redAccent[400] }}>
          <LogoutIcon sx={{ mr: 2 }} />Logout
        </MenuItem>
      </Menu>

      {/* SETTINGS MENU */}
      <Menu
        anchorEl={settingsAnchor}
        open={Boolean(settingsAnchor)}
        onClose={() => setSettingsAnchor(null)}
        PaperProps={{ sx: { backgroundColor: colors.primary[400], color: colors.grey[100], minWidth: 200 } }}
      >
        <MenuItem onClick={() => { setSettingsAnchor(null); onSettingsClick?.('general'); }}>General Settings</MenuItem>
        <MenuItem onClick={() => { setSettingsAnchor(null); onSettingsClick?.('privacy'); }}>Privacy Settings</MenuItem>
        <MenuItem onClick={() => { setSettingsAnchor(null); onSettingsClick?.('notifications'); }}>Notification Settings</MenuItem>
        <Divider sx={{ backgroundColor: colors.grey[700] }} />
        <MenuItem onClick={() => { setSettingsAnchor(null); onSettingsClick?.('help'); }}>Help & Support</MenuItem>
      </Menu>
    </Box>
  );
};

export default Topbar;