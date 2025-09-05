import React, { useState } from "react";
import { Box, IconButton, useMediaQuery, useTheme } from "@mui/material";
import SidebarComponent from "./farmerSidebar";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined"

const FarmerLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box display="flex" height="100vh">
      {/* Sidebar */}
      <SidebarComponent mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content with animation */}
      <Box
        component={motion.main}
        flexGrow={1}
        overflow="auto"
        p={2}
        bgcolor="#f5f5f5"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Hamburger Menu Button on mobile */}
        {isMobile && (
          <IconButton onClick={() => setMobileOpen(true)}>
            <MenuOutlinedIcon />
          </IconButton>
        )}

        <Outlet />
      </Box>
    </Box>
  );
};

export default FarmerLayout;
