import {
  Box,
  Button,
  CardMedia,
  Container,
  Grid,
  Typography,
  Rating,
  Chip,
  Divider,
  IconButton,
  Paper,
  Tab,
  Tabs,
} from "@mui/material";
import {
  ShoppingCart,
  FavoriteBorder,
  Share,
  Add,
  Remove,
  LocalShipping,
  Security,
  Refresh,
} from "@mui/icons-material";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState } from "react";

const mockProduct = {
  id: 1,
  name: "Modern Sectional Sofa",
  images: [
    "https://via.placeholder.com/400x300.png?text=Product+Image+1",
    "https://via.placeholder.com/400x300.png?text=Product+Image+2",
    "https://via.placeholder.com/400x300.png?text=Product+Image+3",
  ],
  price: 1299,
  description: "Transform your living space with this elegant modern sectional sofa. Crafted with premium materials and designed for both comfort and style, this piece features plush cushioning and a sleek silhouette that complements any contemporary decor.",
  inStock: true,
  stockCount: 15,
  category: "Sofas",
};

const ProductDetail: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change));
  };

  return (
    <>
      <NavBar />
      <Container sx={{ py: 4, minHeight: "80vh" }}>
        <Grid container spacing={4}>
          {/* Product Images */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <CardMedia
                component="img"
                height="400"
                image={mockProduct.images[selectedImage]}
                alt={mockProduct.name}
                sx={{ borderRadius: 1, mb: 2 }}
              />
              <Grid container spacing={1}>
                {mockProduct.images.map((image, index) => (
                  <Grid size={{ xs: 3 }} key={index}>
                    <CardMedia
                      component="img"
                      height="80"
                      image={image}
                      alt={`${mockProduct.name} view ${index + 1}`}
                      onClick={() => setSelectedImage(index)}
                      sx={{
                        borderRadius: 1,
                        cursor: "pointer",
                        border: selectedImage === index ? 2 : 1,
                        borderColor: selectedImage === index ? "primary.main" : "grey.300",
                        "&:hover": {
                          borderColor: "primary.main",
                        },
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>

          {/* Product Details */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                {mockProduct.name}
              </Typography>


              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography variant="h5" sx={{ color: "primary.main", fontWeight: "bold" }}>
                  ${mockProduct.price}
                </Typography>
              </Box>

              <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
                {mockProduct.description}
              </Typography>

              <Divider sx={{ mb: 3 }} />

              {/* Quantity and Add to Cart */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Quantity
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <IconButton onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                    <Remove />
                  </IconButton>
                  <Typography variant="h6" sx={{ mx: 2, minWidth: "40px", textAlign: "center" }}>
                    {quantity}
                  </Typography>
                  <IconButton onClick={() => handleQuantityChange(1)}>
                    <Add />
                  </IconButton>
                  <Typography variant="body2" sx={{ ml: 2, color: "text.secondary" }}>
                    {mockProduct.stockCount} in stock
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingCart />}
                  sx={{ flex: 1 }}
                  disabled={!mockProduct.inStock}
                >
                  Add to Cart
                </Button>
                <IconButton size="large">
                  <FavoriteBorder />
                </IconButton>
                <IconButton size="large">
                  <Share />
                </IconButton>
              </Box>

              {/* Product Features */}
              <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-around", textAlign: "center" }}>
                  <Box>
                    <LocalShipping color="primary" sx={{ fontSize: 30, mb: 1 }} />
                    <Typography variant="caption" display="block">
                      Free Shipping
                    </Typography>
                  </Box>
                  <Box>
                    <Security color="primary" sx={{ fontSize: 30, mb: 1 }} />
                    <Typography variant="caption" display="block">
                      2 Year Warranty
                    </Typography>
                  </Box>
                  <Box>
                    <Refresh color="primary" sx={{ fontSize: 30, mb: 1 }} />
                    <Typography variant="caption" display="block">
                      30 Day Returns
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

export default ProductDetail;