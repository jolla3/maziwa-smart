import React, { useState, useEffect, useContext } from "react"; // Added useContext for AuthContext
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Stack,
} from "@mui/material";
import {
  MapPin,
  Eye,
  Heart,
  ShoppingCart,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../../PrivateComponents/AuthContext"; // For user-specific storage
import { imgUrl, getFirstImage } from "../../utils/image.utils";
import { formatCurrency, timeAgo } from "../../utils/currency.utils";
import useListingViews from "../../hooks/useListingViews"; // ✅ Import the new views hook

export default function ModernProductCard({ listing }) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // For user-specific keys

  // ✅ Use the new useListingViews hook for instant, cached views
  const { views, loading: viewsLoading } = useListingViews(listing._id);

  // Ensure a per-device guest identifier
  const ensureGuestId = () => {
    try {
      let id = localStorage.getItem('guestId');
      if (!id) {
        id = (typeof crypto !== '' && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
        localStorage.setItem('guestId', id);
      }
      return id;
    } catch (e) {
      return 'noguest';
    }
  };

  const guestId = ensureGuestId();
  const isAuthenticated = !!user?._id;
  const wishlistKey = isAuthenticated ? `favorites_${user._id}` : `favorites_guest_${guestId}`;
  const basketKey = isAuthenticated ? `basket_${user._id}` : `basket_guest_${guestId}`;

  // Migrate guest keys into authenticated user on login
  useEffect(() => {
    if (!user?._id) return;
    try {
      const guestFavKey = `favorites_guest_${guestId}`;
      const guestBasketKey = `basket_guest_${guestId}`;
      const userFavKey = `favorites_${user._id}`;
      const userBasketKey = `basket_${user._id}`;

      const guestFav = JSON.parse(localStorage.getItem(guestFavKey) || '[]');
      const guestBasket = JSON.parse(localStorage.getItem(guestBasketKey) || '[]');
      const userFav = JSON.parse(localStorage.getItem(userFavKey) || '[]');
      const userBasket = JSON.parse(localStorage.getItem(userBasketKey) || '[]');

      // Merge favorites (ids)
      const mergedFav = Array.from(new Set([...(userFav || []), ...(guestFav || [])]));
      localStorage.setItem(userFavKey, JSON.stringify(mergedFav));

      // Merge basket items by _id
      const map = {};
      (userBasket || []).forEach(i => { if (i && i._id) map[i._id] = i; });
      (guestBasket || []).forEach(i => { if (i && i._id) map[i._id] = i; });
      const mergedBasket = Object.values(map);
      localStorage.setItem(userBasketKey, JSON.stringify(mergedBasket));

      // Remove guest keys
      localStorage.removeItem(guestFavKey);
      localStorage.removeItem(guestBasketKey);
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      // Fail silently
      console.error('Migration error:', err);
    }
  }, [user?._id]);

  const [inWishlist, setInWishlist] = useState(false);
  const [inBasket, setInBasket] = useState(false);

  useEffect(() => {
    // Check if in wishlist (user-specific)
    const favorites = JSON.parse(localStorage.getItem(wishlistKey) || "[]");
    setInWishlist(favorites.includes(listing._id));

    // Check if in basket (user-specific)
    const basket = JSON.parse(localStorage.getItem(basketKey) || "[]");
    setInBasket(basket.some(item => item._id === listing._id));
  }, [listing._id, wishlistKey, basketKey]);

  const isSold = listing.status === "sold";
  const imageCount = listing.photos?.length || listing.images?.length || 0;

  const handleView = () => {
    navigate("/view-market", { state: { listing } });
  };

  const handleWishlist = (e) => {
    e.stopPropagation();

    const favorites = JSON.parse(localStorage.getItem(wishlistKey) || "[]");
    let newFavorites;

    if (favorites.includes(listing._id)) {
      newFavorites = favorites.filter(id => id !== listing._id);
      setInWishlist(false);
    } else {
      newFavorites = [...favorites, listing._id];
      setInWishlist(true);
    }

    localStorage.setItem(wishlistKey, JSON.stringify(newFavorites));
    window.dispatchEvent(new Event('storage'));
  };

  const handleBasket = (e) => {
    e.stopPropagation();
    if (isSold) return;

    const basket = JSON.parse(localStorage.getItem(basketKey) || "[]");
    let newBasket;

    if (basket.some(item => item._id === listing._id)) {
      newBasket = basket.filter(item => item._id !== listing._id);
      setInBasket(false);
    } else {
      newBasket = [...basket, { ...listing, addedAt: new Date().toISOString() }];
      setInBasket(true);
    }

    localStorage.setItem(basketKey, JSON.stringify(newBasket));
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <Card
      onClick={handleView}
      sx={{
        cursor: "pointer",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease",
        backgroundColor: "#ffffff",
        border: "1px solid #e5e7eb",
        opacity: isSold ? 0.7 : 1,
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 12px 24px rgba(16, 185, 129, 0.2)",
          borderColor: "#10b981",
        },
      }}
    >
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="220"
          image={imgUrl(getFirstImage(listing))}
          alt={listing.title}
          sx={{
            objectFit: "cover",
            backgroundColor: "#f9fafb",
          }}
        />

        <Stack
          direction="row"
          spacing={1}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
          }}
        >
          <IconButton
            size="small"
            onClick={handleWishlist}
            sx={{
              backgroundColor: inWishlist ? "#ef4444" : "white",
              color: inWishlist ? "white" : "#ef4444",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              "&:hover": {
                backgroundColor: inWishlist ? "#dc2626" : "#fee2e2",
                transform: "scale(1.1)",
              },
            }}
          >
            <Heart
              size={18}
              fill={inWishlist ? "white" : "none"}
            />
          </IconButton>

          <IconButton
            size="small"
            onClick={handleBasket}
            disabled={isSold}
            sx={{
              backgroundColor: inBasket ? "#10b981" : "white",
              color: inBasket ? "white" : "#10b981",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              "&:hover": {
                backgroundColor: inBasket ? "#059669" : "#d1fae5",
                transform: "scale(1.1)",
              },
              "&.Mui-disabled": {
                backgroundColor: "#e5e7eb",
                color: "#9ca3af",
              },
            }}
          >
            <ShoppingCart size={18} />
          </IconButton>
        </Stack>

        <Chip
          label={listing.animal_id?.species || "Livestock"}
          size="small"
          sx={{
            position: "absolute",
            bottom: 12,
            left: 12,
            backgroundColor: "#10b981",
            color: "white",
            fontWeight: 600,
            textTransform: "capitalize",
          }}
        />

        {imageCount > 1 && (
          <Box
            sx={{
              position: "absolute",
              bottom: 12,
              right: 12,
              backgroundColor: "white",
              color: "#0f172a",
              px: 1.5,
              py: 0.5,
              borderRadius: 2,
              fontSize: "0.75rem",
              fontWeight: 600,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            {imageCount} photos
          </Box>
        )}

        {isSold && (
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#ef4444",
              color: "white",
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 700,
              fontSize: "1.2rem",
              boxShadow: 3,
            }}
          >
            SOLD
          </Box>
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", backgroundColor: "white", p: 3 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 1.5,
            color: "#0f172a",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            minHeight: "3em",
          }}
        >
          {listing.title}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <MapPin size={16} color="#10b981" style={{ marginRight: 6 }} />
          <Typography
            variant="body2"
            sx={{
              color: "#0f172a",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {listing.location || "Location N/A"}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "#10b981",
            }}
          >
            {formatCurrency(listing.price)}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}>
          {listing.animal_id?.gender && (
            <Chip
              label={listing.animal_id.gender}
              size="small"
              sx={{
                backgroundColor: "#3b82f6",
                color: "white",
                fontSize: "0.75rem",
                fontWeight: 600,
              }}
            />
          )}
          {listing.animal_id?.stage && (
            <Chip
              label={listing.animal_id.stage}
              size="small"
              sx={{
                backgroundColor: "#8b5cf6",
                color: "white",
                fontSize: "0.75rem",
                fontWeight: 600,
              }}
            />
          )}
          {listing.animal_id?.status === "pregnant" && (
            <Chip
              label="Pregnant"
              size="small"
              sx={{
                backgroundColor: "#f59e0b",
                color: "white",
                fontSize: "0.75rem",
                fontWeight: 600,
              }}
            />
          )}
        </Stack>

        <Box
          sx={{
            mt: "auto",
            pt: 2,
            borderTop: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Calendar size={14} color="#10b981" style={{ marginRight: 4 }} />
            <Typography variant="caption" sx={{ color: "#0f172a", fontWeight: 500 }}>
              {timeAgo(listing.createdAt)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
    <Eye size={14} color="#10b981" style={{ marginRight: 4 }} />
    <Typography variant="caption" sx={{ color: "#0f172a", fontWeight: 500 }}>
      {listing.views?.count || 0} views {/* ✅ Use views directly from listing prop */}
    </Typography>
  </Box>
        </Box>
      </CardContent>
    </Card>
  );
}