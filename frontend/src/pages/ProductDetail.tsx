import {
  Box,
  Button,
  CardMedia,
  Container,
  Grid,
  Typography,
  Divider,
  IconButton,
  Paper,
  CircularProgress,
  Alert,
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
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductWithCategory, type ProductWithCategory } from "../data/productData";



const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [product, setProduct] = useState<ProductWithCategory | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError('Product ID not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const productData = await getProductWithCategory(id);
        setProduct(productData);
        setError(null);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to fetch product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change));
  };

  if (loading) {
    return (
      <>
        <NavBar />
        <Container sx={{ py: 4, minHeight: "80vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <CircularProgress size={60} />
        </Container>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <NavBar />
        <Container sx={{ py: 4, minHeight: "80vh" }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error || 'Product not found'}
          </Alert>
          <Button variant="contained" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </Container>
        <Footer />
      </>
    );
  }

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
                image={(product.images && product.images.length > 0) ? product.images[selectedImage] : '/placeholder-image.jpg'}
                alt={product.name}
                sx={{ borderRadius: 1, mb: 2 }}
              />
              {product.images && product.images.length > 1 && (
                <Grid container spacing={1}>
                  {product.images.map((image: string, index: number) => (
                    <Grid size={{ xs: 3 }} key={index}>
                      <CardMedia
                        component="img"
                        height="80"
                        image={image}
                        alt={`${product.name} view ${index + 1}`}
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
              )}
            </Paper>
          </Grid>

          {/* Product Details */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                {product.name}
              </Typography>

              {product.category && (
                <Typography variant="subtitle1" sx={{ color: "text.secondary", mb: 1 }}>
                  Category: {product.category.name}
                </Typography>
              )}

              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography variant="h5" sx={{ color: "primary.main", fontWeight: "bold" }}>
                  ${product.price}
                </Typography>
              </Box>

              <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
                {product.description}
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
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingCart />}
                  sx={{ flex: 1 }}
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