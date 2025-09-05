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
import { useContext, useState } from "react";
import { ColorModeContext, tokens } from "../../theme";
import { AuthContext } from "../../components/PrivateComponents/AuthContext"; // Adjust path as needed
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

const Topbar = ({ onSearch, notifications = [], onNotificationClick, onSettingsClick, onProfileAction }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const { user, logout } = useContext(AuthContext);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State management
  const [searchValue, setSearchValue] = useState("");
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [profileAnchor, setProfileAnchor] = useState(null);
  const [settingsAnchor, setSettingsAnchor] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Calculate unread notifications count from real data
  const unreadCount = notifications.filter(n => n.unread).length;

  // Handlers
  const handleSearch = () => {
    if (searchValue.trim() && onSearch) {
      onSearch(searchValue.trim());
    }
  };

  const handleSearchKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleProfileClick = (event) => {
    setProfileAnchor(event.currentTarget);
  };

  const handleSettingsClick = (event) => {
    setSettingsAnchor(event.currentTarget);
  };

  const handleCloseMenus = () => {
    setNotificationAnchor(null);
    setProfileAnchor(null);
    setSettingsAnchor(null);
  };

  const handleLogout = () => {
    handleCloseMenus();
    logout();
  };

  const handleNotificationItemClick = (notification) => {
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
    handleCloseMenus();
  };

  // Desktop Icons Component
  const DesktopIcons = () => (
    <Box display="flex" alignItems="center" gap={1}>
      <Tooltip title="Toggle theme">
        <IconButton 
          onClick={colorMode.toggleColorMode}
          aria-label="Toggle color mode"
          sx={{ color: colors.grey[100] }}
        >
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
      </Tooltip>

      <Tooltip title="Notifications">
        <IconButton 
          onClick={handleNotificationClick}
          aria-label={`${unreadCount} unread notifications`}
          sx={{ color: colors.grey[100] }}
        >
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsOutlinedIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Tooltip title="Settings">
        <IconButton 
          onClick={handleSettingsClick}
          aria-label="Settings"
          sx={{ color: colors.grey[100] }}
        >
          <SettingsOutlinedIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Profile">
        <IconButton 
          onClick={handleProfileClick}
          aria-label="User profile"
          sx={{ color: colors.grey[100] }}
        >
          {user?.avatar ? (
            <Avatar 
              src={user.avatar} 
              alt={user.name}
              sx={{ width: 32, height: 32 }}
            />
          ) : (
            <PersonOutlinedIcon />
          )}
        </IconButton>
      </Tooltip>
    </Box>
  );

  // Mobile Icons Component
  const MobileIcons = () => (
    <Box display="flex" alignItems="center">
      <Tooltip title="Toggle theme">
        <IconButton 
          onClick={colorMode.toggleColorMode}
          aria-label="Toggle color mode"
          sx={{ color: colors.grey[100] }}
        >
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
      </Tooltip>

      <Tooltip title="Menu">
        <IconButton 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Open menu"
          sx={{ color: colors.grey[100] }}
        >
          {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
      </Tooltip>
    </Box>
  );

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
        {/* SEARCH BAR */}
        <Box
          display="flex"
          backgroundColor={colors.primary[400]}
          borderRadius="3px"
          minWidth={isMobile ? "200px" : "300px"}
          maxWidth={isMobile ? "250px" : "400px"}
          sx={{ 
            transition: 'all 0.3s ease',
            '&:focus-within': {
              boxShadow: `0 0 0 2px ${colors.blueAccent[500]}`,
            }
          }}
        >
          <InputBase 
            sx={{ 
              ml: 2, 
              flex: 1, 
              color: colors.grey[100],
              '&::placeholder': {
                color: colors.grey[300]
              }
            }} 
            placeholder="Search..." 
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyPress={handleSearchKeyPress}
            aria-label="Search"
          />
          <Tooltip title="Search">
            <IconButton 
              type="button" 
              sx={{ p: 1, color: colors.grey[100] }}
              onClick={handleSearch}
              aria-label="Execute search"
            >
              <SearchIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* ICONS */}
        {isMobile ? <MobileIcons /> : <DesktopIcons />}
      </Box>

      {/* MOBILE MENU */}
      {isMobile && (
        <Collapse in={mobileMenuOpen}>
          <Box 
            p={2} 
            backgroundColor={colors.primary[400]}
            borderTop={`1px solid ${colors.grey[700]}`}
          >
            <Box display="flex" flexDirection="column" gap={2}>
              <Box display="flex" alignItems="center" gap={2}>
                <Tooltip title="Notifications">
                  <IconButton 
                    onClick={handleNotificationClick}
                    sx={{ color: colors.grey[100] }}
                  >
                    <Badge badgeContent={unreadCount} color="error">
                      <NotificationsOutlinedIcon />
                    </Badge>
                  </IconButton>
                </Tooltip>
                <Typography color={colors.grey[100]}>Notifications</Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={2}>
                <Tooltip title="Settings">
                  <IconButton 
                    onClick={handleSettingsClick}
                    sx={{ color: colors.grey[100] }}
                  >
                    <SettingsOutlinedIcon />
                  </IconButton>
                </Tooltip>
                <Typography color={colors.grey[100]}>Settings</Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={2}>
                <Tooltip title="Profile">
                  <IconButton 
                    onClick={handleProfileClick}
                    sx={{ color: colors.grey[100] }}
                  >
                    {user?.avatar ? (
                      <Avatar 
                        src={user.avatar} 
                        alt={user.name}
                        sx={{ width: 32, height: 32 }}
                      />
                    ) : (
                      <PersonOutlinedIcon />
                    )}
                  </IconButton>
                </Tooltip>
                <Typography color={colors.grey[100]}>Profile</Typography>
              </Box>
            </Box>
          </Box>
        </Collapse>
      )}

      {/* NOTIFICATIONS MENU */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleCloseMenus}
        PaperProps={{
          sx: {
            backgroundColor: colors.primary[400],
            color: colors.grey[100],
            minWidth: 300,
            maxHeight: 400,
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem disabled>
          <Typography variant="h6" color={colors.grey[100]}>
            Notifications {unreadCount > 0 && `(${unreadCount} new)`}
          </Typography>
        </MenuItem>
        <Divider sx={{ backgroundColor: colors.grey[700] }} />
        {notifications.length === 0 ? (
          <MenuItem disabled>
            <Typography variant="body2" color={colors.grey[300]}>
              No notifications
            </Typography>
          </MenuItem>
        ) : (
          notifications.map((notification) => (
            <MenuItem 
              key={notification.id}
              onClick={() => handleNotificationItemClick(notification)}
              sx={{
                backgroundColor: notification.unread ? colors.blueAccent[800] : 'transparent',
                '&:hover': {
                  backgroundColor: colors.blueAccent[700],
                }
              }}
            >
              <Box>
                <Typography variant="body2" color={colors.grey[100]}>
                  {notification.title}
                </Typography>
                <Typography variant="caption" color={colors.grey[300]}>
                  {notification.time || notification.createdAt}
                </Typography>
              </Box>
            </MenuItem>
          ))
        )}
      </Menu>

      {/* PROFILE MENU */}
      <Menu
        anchorEl={profileAnchor}
        open={Boolean(profileAnchor)}
        onClose={handleCloseMenus}
        PaperProps={{
          sx: {
            backgroundColor: colors.primary[400],
            color: colors.grey[100],
            minWidth: 200,
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {user && (
          <MenuItem disabled>
            <Box display="flex" alignItems="center" gap={2}>
              {user.avatar ? (
                <Avatar src={user.avatar} alt={user.name} sx={{ width: 32, height: 32 }} />
              ) : (
                <PersonOutlinedIcon />
              )}
              <Box>
                <Typography variant="body2" color={colors.grey[100]}>
                  {user.name || 'User'}
                </Typography>
                <Typography variant="caption" color={colors.grey[300]}>
                  {user.email || 'user@example.com'}
                </Typography>
              </Box>
            </Box>
          </MenuItem>
        )}
        <Divider sx={{ backgroundColor: colors.grey[700] }} />
        <MenuItem onClick={() => { handleCloseMenus(); onProfileAction?.('view-profile'); }}>
          <PersonOutlinedIcon sx={{ mr: 2 }} />
          View Profile
        </MenuItem>
        <MenuItem onClick={() => { handleCloseMenus(); onProfileAction?.('account-settings'); }}>
          <SettingsOutlinedIcon sx={{ mr: 2 }} />
          Account Settings
        </MenuItem>
        <Divider sx={{ backgroundColor: colors.grey[700] }} />
        <MenuItem onClick={handleLogout} sx={{ color: colors.redAccent[400] }}>
          <LogoutIcon sx={{ mr: 2 }} />
          Logout
        </MenuItem>
      </Menu>

      {/* SETTINGS MENU */}
      <Menu
        anchorEl={settingsAnchor}
        open={Boolean(settingsAnchor)}
        onClose={handleCloseMenus}
        PaperProps={{
          sx: {
            backgroundColor: colors.primary[400],
            color: colors.grey[100],
            minWidth: 200,
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => { handleCloseMenus(); onSettingsClick?.('general'); }}>
          General Settings
        </MenuItem>
        <MenuItem onClick={() => { handleCloseMenus(); onSettingsClick?.('privacy'); }}>
          Privacy Settings
        </MenuItem>
        <MenuItem onClick={() => { handleCloseMenus(); onSettingsClick?.('notifications'); }}>
          Notification Settings
        </MenuItem>
        <Divider sx={{ backgroundColor: colors.grey[700] }} />
        <MenuItem onClick={() => { handleCloseMenus(); onSettingsClick?.('help'); }}>
          Help & Support
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Topbar;