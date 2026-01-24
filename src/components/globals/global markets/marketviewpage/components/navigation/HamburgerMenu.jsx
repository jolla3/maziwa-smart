// marketviewpage/components/navigation/HamburgerMenu.jsx
import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Typography,
  Box,
  Badge,
  IconButton,
} from "@mui/material";
import {
  Heart,
  ShoppingCart,
  ShoppingBag,
  Clock,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HamburgerMenu({ open, onClose, onNavigate }) {
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
    if (open) {
      updateCounts();
    }

    const handleStorageChange = () => {
      updateCounts();
    };

    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(updateCounts, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [open]);

  const menuItems = [
    {
      text: "Wishlist",
      icon: Heart,
      page: "wishlist",
      badge: wishlistCount,
      color: "#ef4444",
    },
    {
      text: "Basket",
      icon: ShoppingCart,
      page: "basket",
      badge: basketCount,
      color: "#10b981",
    },
    {
      text: "Previous Purchases",
      icon: ShoppingBag,
      page: "purchases",
      color: "#3b82f6",
    },
    {
      text: "Recent Activity",
      icon: Clock,
      page: "activity",
      color: "#8b5cf6",
    },
  ];

  const handleNavigate = (page) => {
    if (onNavigate) {
      onNavigate(page);
    } else {
      navigate(`/market/${page}`);
    }
    onClose();
  };

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box sx={{ width: 280, backgroundColor: "#fff", height: "100%" }}>
        <Box
          sx={{
            p: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "2px solid #e5e7eb",
          }}
        >
          <Typography variant="h6" fontWeight={700} sx={{ color: "#0f172a" }}>
            Menu
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              color: "#0f172a",
              "&:hover": {
                backgroundColor: "#f1f5f9",
              },
            }}
          >
            <X size={20} />
          </IconButton>
        </Box>

        <List sx={{ pt: 2 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => handleNavigate(item.page)}
                sx={{
                  py: 1.5,
                  "&:hover": {
                    backgroundColor: `${item.color}15`,
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Badge
                    badgeContent={item.badge}
                    color="error"
                    invisible={!item.badge}
                  >
                    <item.icon size={22} color={item.color} />
                  </Badge>
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: 600,
                    color: "#0f172a",
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ px: 3, py: 2 }}>
          <Typography variant="caption" sx={{ color: "#0f172a", fontWeight: 500 }}>
            Premium Livestock Marketplace
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
}