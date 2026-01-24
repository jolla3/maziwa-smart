// marketviewpage/components/listings/ListingActions.jsx
import React from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import { Heart, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useWishlist } from "../../context/WishlistContext";
import { useBasket } from "../../context/BasketContext";

export default function ListingActions({ listing, isSold }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInBasket, addToBasket, removeFromBasket } = useBasket();

  const inWishlist = isInWishlist(listing._id);
  const inBasket = isInBasket(listing._id);

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    toggleWishlist(listing._id);
  };

  const handleBasketClick = (e) => {
    e.stopPropagation();
    if (isSold) return;
    
    if (inBasket) {
      removeFromBasket(listing._id);
    } else {
      addToBasket(listing);
    }
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: 8,
        left: 8,
        display: "flex",
        gap: 1,
        zIndex: 10,
      }}
    >
      <Tooltip title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <IconButton
            size="small"
            onClick={handleWishlistClick}
            sx={{
              backgroundColor: inWishlist ? "#ef4444" : "white",
              color: inWishlist ? "white" : "#ef4444",
              boxShadow: 2,
              "&:hover": {
                backgroundColor: inWishlist ? "#dc2626" : "#fee2e2",
              },
            }}
          >
            <Heart size={16} fill={inWishlist ? "white" : "none"} />
          </IconButton>
        </motion.div>
      </Tooltip>

      <Tooltip
        title={
          isSold
            ? "Item sold"
            : inBasket
            ? "Remove from basket"
            : "Add to basket"
        }
      >
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <IconButton
            size="small"
            onClick={handleBasketClick}
            disabled={isSold}
            sx={{
              backgroundColor: inBasket ? "#10b981" : "white",
              color: inBasket ? "white" : "#10b981",
              boxShadow: 2,
              "&:hover": {
                backgroundColor: inBasket ? "#059669" : "#d1fae5",
              },
              "&.Mui-disabled": {
                backgroundColor: "#e5e7eb",
                color: "#9ca3af",
              },
            }}
          >
            <ShoppingCart size={16} />
          </IconButton>
        </motion.div>
      </Tooltip>
    </Box>
  );
}