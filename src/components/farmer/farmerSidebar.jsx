import { useState, useContext } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import {
  Box,
  IconButton,
  Typography,
  useTheme,
  Drawer,
  useMediaQuery,
  Avatar,
  Button,
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined"
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined"
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined"
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined"
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined"
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined"
import MapOutlinedIcon from "@mui/icons-material/MapOutlined"

import { NavLink } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";

// import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { AuthContext } from "../PrivateComponents/AuthContext"; // 👈 import context

// Example sidebarItems and Item component
const sidebarItems = [
  {
    section: "Main",
    items: [
      { title: "Dashboard", to: "/farmerdashboard", icon: <HomeOutlinedIcon /> },
    ],
  },
  {
    section: "Data",
    items: [
      {
        title: "My milk summary ",
        to: "/farmerdashboard/daily",
        icon: <PeopleOutlinedIcon />,
      },
      {
        title: "My farm Breeds",
        to: "/farmerdashboard/breeds",
        icon: <ContactsOutlinedIcon />,
      },
      {
        title: "My Farm",
        to: "/farmerdashboard/cows",
        icon: <ReceiptOutlinedIcon />,
      },
    ],
  },
  {
    section: "Pages",
    items: [
      {
        title: "Milk Recording",
        to: "/farmerdashboard/milkrecording",
        icon: <PersonOutlinedIcon />,
      },
      
      {
        title: "Insemination Card  ",
        to: "/farmerdashboard/insemination-record",
        icon: <PersonOutlinedIcon />,
      },
      {
        title: "Calendar",
        to: "/farmerdashboard/calendar",
        icon: <CalendarTodayOutlinedIcon />,
      },
      { title: "FAQ Page", to: "/farmerdashboard/farmerdash", icon: <HelpOutlineOutlinedIcon /> },
    ],
  },
  {
    section: "Charts",
    items: [
      { title: "Bar Chart", to: "/bar", icon: <BarChartOutlinedIcon /> },
      { title: "Pie Chart", to: "/pie", icon: <PieChartOutlineOutlinedIcon /> },
      { title: "Line Chart", to: "/line", icon: <TimelineOutlinedIcon /> },
      { title: "Geography Chart", to: "/geography", icon: <MapOutlinedIcon /> },
    ],
  },
];


// Example Item component
const Item = ({ title, to, icon }) => (
  <MenuItem icon={icon}>
    <NavLink
      to={to}
      style={({ isActive }) => ({
        textDecoration: "none",
        color: isActive ? "#6870fa" : "inherit", // ✅ highlight active
        display: "block",
        width: "100%",
      })}
    >
      <Typography>{title}</Typography>
    </NavLink>
  </MenuItem>
);



const SidebarComponent = ({ mobileOpen, setMobileOpen }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // ✅ get user from context
  const { user, logout } = useContext(AuthContext);

  // ✅ state for uploaded profile image
  const [profileImage, setProfileImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const sidebarContent = (
    <Box
      sx={{
        height: "100vh",
        "& .pro-sidebar-inner": {
          backgroundColor: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* Logo & toggle */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                DASHBOARD
                </Typography>
                <IconButton
                  onClick={() => {
                    if (isMobile) {
                      setMobileOpen(false);
                    } else {
                      setIsCollapsed(!isCollapsed);
                    }
                  }}
                >
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {/* ✅ Profile section */}
          {!isCollapsed && (
            <Box mb="25px" textAlign="center">
              <label htmlFor="upload-profile">
                <input
                  accept="image/*"
                  id="upload-profile"
                  type="file"
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
                />
                <Avatar
                  alt={user?.name || "User"}
                  src={profileImage || "../../assets/user.png"}
                  sx={{
                    width: 100,
                    height: 100,
                    margin: "0 auto",
                    cursor: "pointer",
                    border: `3px solid ${colors.grey[300]}`,
                  }}
                />
              </label>

              <Typography
                variant="h2"
                color={colors.grey[100]}
                fontWeight="bold"
                sx={{ mt: "10px" }}
              >
                {user?.name || "Guest"}
              </Typography>
              <Typography variant="h5" color={colors.blueAccent[400]}>
                {user?.role || "Role"}
              </Typography>

              {/* logout button */}
              <Button
                variant="outlined"
                color="error"
                size="small"
                sx={{ mt: 1 }}
                onClick={logout}
              >
                Logout
              </Button>
            </Box>
          )}

          {/* Menu sections (your sidebarItems) */}
          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            {sidebarItems.map(({ section, items }) => (
              <Box key={section} mb="10px">
                {!isCollapsed && (
                  <Typography
                    variant="h6"
                    color={colors.grey[300]}
                    sx={{ m: "15px 0 5px 20px" }}
                  >
                    {section}
                  </Typography>
                )}
                {items.map(({ title, to, icon }) => (
                  <Item key={title} title={title} to={to} icon={icon} />
                ))}
              </Box>
            ))}
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
      >
        {sidebarContent}
      </Drawer>
    );
  }

  return sidebarContent;
};

export default SidebarComponent;
