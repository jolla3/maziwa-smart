// marketviewpage/pages/BasketPage.jsx
import React from "react";
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
import { ArrowLeft, Trash2, ShoppingCart } from "lucide-react";
import { useBasket } from "../context/BasketContext";
import { imgUrl, getFirstImage } from "../utils/image.utils";
import { formatCurrency } from "../utils/currency.utils";

export default function BasketPage({ onBack }) {
  const { basket, removeFromBasket, clearBasket } = useBasket();
 

  // const onBack = () => {

  // }
  
  const totalPrice = basket.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <Box sx={{ backgroundColor: "#ffffff", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton onClick={onBack} sx={{ color: "#000" }}>
            <ArrowLeft size={24} />
          </IconButton>
          <Typography variant="h4" fontWeight="bold" sx={{ color: "#000" }}>
            My Basket
          </Typography>
          <Chip
            icon={<ShoppingCart size={16} />}
            label={`${basket.length} items`}
            color="success"
            sx={{ ml: 2 }}
          />
        </Box>

        {basket.length === 0 ? (
          <Card sx={{ p: 6, textAlign: "center" }}>
            <ShoppingCart size={64} color="#ccc" style={{ marginBottom: 16 }} />
            <Typography variant="h6" sx={{ color: "#000", mb: 2 }}>
              Your basket is empty
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
          <>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
              <Typography variant="h5" sx={{ color: "#000" }}>
                Total: <strong style={{ color: "#10b981" }}>{formatCurrency(totalPrice)}</strong>
              </Typography>
              <Button
                variant="outlined"
                color="error"
                onClick={clearBasket}
                sx={{ textTransform: "none" }}
              >
                Clear Basket
              </Button>
            </Box>

            <Grid container spacing={3}>
              {basket.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item._id}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="200"
                      image={imgUrl(getFirstImage(item))}
                      alt={item.title}
                      sx={{ objectFit: "cover" }}
                    />
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
                          <Chip label={item.animal_id.species} size="small" />
                        )}
                      </Box>

                      <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        startIcon={<Trash2 size={18} />}
                        onClick={() => removeFromBasket(item._id)}
                        sx={{ textTransform: "none" }}
                      >
                        Remove
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ mt: 4, textAlign: "center" }}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  textTransform: "none",
                  px: 6,
                  py: 1.5,
                  backgroundColor: "#10b981",
                  "&:hover": { backgroundColor: "#059669" },
                }}
              >
                Proceed to Checkout
              </Button>
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
}