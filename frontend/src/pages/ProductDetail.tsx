import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Divider,
  IconButton,
  Paper,
  CircularProgress,
  Alert,
  CardMedia,
} from "@mui/material";
import {
  ShoppingCart,
  FavoriteBorder,
  Favorite,
  Share,
  Add,
  Remove,
  LocalShipping,
  Security,
  Refresh,
} from "@mui/icons-material";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";
import LoginRequiredAlert from "../components/ui/LoginRequiredAlert";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useAuthStore } from '../store/authStore';
import { useProductsStore } from '../store/productsStore';
import { useUIStore } from '../store/uiStore';

const ProductDetail: React.FC = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  
  const { 
    currentProduct: product, 
    loading, 
    error, 
    fetchSingleProduct 
  } = useProductsStore();
  
  const { 
    selectedImage, 
    quantity,
    setSelectedImage,
    incrementQuantity,
    decrementQuantity
  } = useUIStore();
  
  const { isLoggedIn } = useAuthStore();
  const { addItemToCart } = useCartStore();
  const { addItemToWishlist, isInWishlist } = useWishlistStore();

  // Alert state management
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleAddToCart = async () => {
    if (!product) return;
    
    if (!isLoggedIn) {
      setAlertMessage("Please log in to add items to your cart");
      setShowLoginAlert(true);
      return;
    }
    
    try {
      await addItemToCart(product._id, quantity);
      console.log('Product added to cart:', product._id, 'Quantity:', quantity);
    } catch (error) {
      console.error('Failed to add product to cart:', error);
    }
  };

  const handleAddToWishlist = async () => {
    if (!product) return;
    
    if (!isLoggedIn) {
      setAlertMessage("Please log in to save items to your wishlist");
      setShowLoginAlert(true);
      return;
    }

    try {
      if (isInWishlist(product._id)) {
        console.log('Product already in wishlist');
        return;
      }
      
      await addItemToWishlist(product._id);
      console.log('Product added to wishlist:', product._id);
    } catch (error) {
      console.error('Failed to add product to wishlist:', error);
    }
  };

  const handleShare = async () => {
    if (!product) return;
    
    const shareData = {
      title: product.name,
      text: `Check out this amazing product: ${product.name}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        console.log('Product shared successfully');
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        // You could show a toast notification here
        console.log('Product URL copied to clipboard');
        alert('Product URL copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing product:', error);
    }
  };

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) {
        return;
      }

      try {
        await fetchSingleProduct(productId);
      } catch (err) {
        console.error('Error loading product:', err);
      }
    };

    loadProduct();
  }, [productId, fetchSingleProduct]);

  const handleQuantityChange = (change: number) => {
    if (change > 0) {
      incrementQuantity();
    } else if (change < 0) {
      decrementQuantity();
    }
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
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
                <IconButton 
                  size="large" 
                  onClick={handleAddToWishlist}
                  color={product && isInWishlist(product._id) ? "error" : "default"}
                  title="Add to Wishlist"
                >
                  {product && isInWishlist(product._id) ? <Favorite /> : <FavoriteBorder />}
                </IconButton>
                <IconButton 
                  size="large"
                  onClick={handleShare}
                  title="Share Product"
                >
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

        {/* Login Required Alert */}
        <LoginRequiredAlert 
          open={showLoginAlert} 
          onClose={() => setShowLoginAlert(false)}
          message={alertMessage}
        />
      </Container>
      <Footer />
    </>
  );
};

export default ProductDetail;