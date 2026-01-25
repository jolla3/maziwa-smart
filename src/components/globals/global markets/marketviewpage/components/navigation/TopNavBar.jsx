// marketviewpage/components/navigation/TopNavBar.jsx
import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, IconButton, Typography, Badge, Box } from "@mui/material";
import { Menu, Heart, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TopNavBar({ onMenuClick }) {
  const navigate = useNavigate();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [basketCount, setBasketCount] = useState(0);

  const updateCounts = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    const basket = JSON.parse(localStorage.getItem("basket") || "[]");
    setWishlistCount(favorites.length);
    setBasketCount(basket.length);
  };

  useEffect(() => {
    updateCounts();
    
    const handleStorageChange = () => {
      updateCounts();
    };
    
    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(updateCounts, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "#ffffff",
        borderBottom: "2px solid #e5e7eb",
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, color: "#0f172a" }}
        >
          <Menu size={24} />
        </IconButton>

        <Typography
          variant="h6"
          component="div"
          sx={{ 
            flexGrow: 1, 
            fontWeight: 700, 
            color: "#0f172a",
            fontSize: "1.25rem",
          }}
        >
          🐄 Livestock Market
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton 
            onClick={() => navigate("/market/wishlist")}
            sx={{ 
              color: "#0f172a",
              "&:hover": {
                backgroundColor: "#fee2e2",
              },
            }}
          >
            <Badge badgeContent={wishlistCount} color="error">
              <Heart size={22} />
            </Badge>
          </IconButton>

          <IconButton 
            onClick={() => navigate("/market/basket")}
            sx={{ 
              color: "#0f172a",
              "&:hover": {
                backgroundColor: "#d1fae5",
              },
            }}
          >
            <Badge badgeContent={basketCount} sx={{ "& .MuiBadge-badge": { backgroundColor: "#10b981", color: "white" } }}>
              <ShoppingCart size={22} />
            </Badge>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}