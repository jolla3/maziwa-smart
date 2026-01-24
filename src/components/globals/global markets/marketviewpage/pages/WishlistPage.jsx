// marketviewpage/pages/WishlistPage.jsx
import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Chip,
} from "@mui/material";
import { ArrowLeft, Trash2, Heart, ShoppingCart } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useBasket } from "../context/BasketContext";
import { AuthContext } from "../../../../PrivateComponents/AuthContext";
import { marketApi } from "../api/market.api";
import { imgUrl, getFirstImage } from "../utils/image.utils";
import { formatCurrency } from "../utils/currency.utils";

export default function WishlistPage({ onBack }) {
  const { token } = useContext(AuthContext);
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToBasket, isInBasket } = useBasket();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistItems = async () => {
      if (wishlist.length === 0) {
        setWishlistItems([]);
        setLoading(false);
        return;
      }

      try {
        const { listings } = await marketApi.fetchListings({}, token);
        const items = listings.filter((item) => wishlist.includes(item._id));
        setWishlistItems(items);
      } catch (err) {
        console.error("Error fetching wishlist items:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistItems();
  }, [wishlist, token]);

  const handleRemove = (id) => {
    toggleWishlist(id);
  };

  const handleAddToBasket = (item) => {
    if (!isInBasket(item._id) && item.status !== "sold") {
      addToBasket(item);
    }
  };

  return (
    <Box sx={{ backgroundColor: "#ffffff", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton onClick={onBack} sx={{ color: "#000" }}>
            <ArrowLeft size={24} />
          </IconButton>
          <Typography variant="h4" fontWeight="bold" sx={{ color: "#000" }}>
            My Wishlist
          </Typography>
          <Chip
            icon={<Heart size={16} />}
            label={`${wishlistItems.length} items`}
            color="error"
            sx={{ ml: 2 }}
          />
        </Box>

        {loading ? (
          <Typography sx={{ color: "#000" }}>Loading wishlist...</Typography>
        ) : wishlistItems.length === 0 ? (
          <Card sx={{ p: 6, textAlign: "center" }}>
            <Heart size={64} color="#ccc" style={{ marginBottom: 16 }} />
            <Typography variant="h6" sx={{ color: "#000", mb: 2 }}>
              Your wishlist is empty
            </Typography>
            <Button
              variant="contained"
              onClick={onBack}
              sx={{ textTransform: "none" }}
            >
              Browse Listings
            </Button>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {wishlistItems.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item._id}>
                <Card
                  sx={{
                    position: "relative",
                    "&:hover": { boxShadow: 6 },
                    opacity: item.status === "sold" ? 0.6 : 1,
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={imgUrl(getFirstImage(item))}
                    alt={item.title}
                    sx={{ objectFit: "cover" }}
                  />

                  <IconButton
                    onClick={() => handleRemove(item._id)}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      backgroundColor: "rgba(255,255,255,0.9)",
                      "&:hover": { backgroundColor: "#fee2e2" },
                    }}
                  >
                    <Trash2 size={18} color="#ef4444" />
                  </IconButton>

                  {item.status === "sold" && (
                    <Chip
                      label="SOLD"
                      color="error"
                      sx={{
                        position: "absolute",
                        top: 8,
                        left: 8,
                        fontWeight: "bold",
                      }}
                    />
                  )}

                  <CardContent>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{ color: "#000", mb: 1 }}
                      noWrap
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{ color: "#10b981", fontWeight: "bold", mb: 2 }}
                    >
                      {formatCurrency(item.price)}
                    </Typography>

                    <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                      {item.animal_id?.species && (
                        <Chip
                          label={item.animal_id.species}
                          size="small"
                          sx={{ color: "#000" }}
                        />
                      )}
                      {item.animal_id?.gender && (
                        <Chip
                          label={item.animal_id.gender}
                          size="small"
                          variant="outlined"
                          sx={{ color: "#000" }}
                        />
                      )}
                    </Box>

                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<ShoppingCart size={18} />}
                      onClick={() => handleAddToBasket(item)}
                      disabled={item.status === "sold" || isInBasket(item._id)}
                      sx={{
                        textTransform: "none",
                        backgroundColor: "#10b981",
                        "&:hover": { backgroundColor: "#059669" },
                      }}
                    >
                      {isInBasket(item._id)
                        ? "In Basket"
                        : item.status === "sold"
                        ? "Sold Out"
                        : "Add to Basket"}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}