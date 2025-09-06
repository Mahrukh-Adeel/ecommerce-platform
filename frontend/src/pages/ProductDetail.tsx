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
    decrementQuantity,
    resetQuantity
  } = useUIStore();
  
  const { addItemToCart } = useCartStore();
  const { 
    isInWishlist, 
    addItemToWishlist, 
    removeItemFromWishlist 
  } = useWishlistStore();
  const { isLoggedIn } = useAuthStore();

  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const features = [
    { icon: <LocalShipping />, text: "Free shipping on orders over $500" },
    { icon: <Security />, text: "2-year warranty included" },
    { icon: <Refresh />, text: "Easy returns within 30 days" }
  ];

  useEffect(() => {
    if (productId) {
      fetchSingleProduct(productId);
      resetQuantity();
    }
  }, [productId, fetchSingleProduct, resetQuantity]);

  const handleQuantityChange = (delta: number) => {
    if (delta > 0) {
      incrementQuantity();
    } else if (delta < 0 && quantity > 1) {
      decrementQuantity();
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    if (!isLoggedIn) {
      setAlertMessage("Please log in to add items to your cart");
      setShowLoginAlert(true);
      return;
    }
    
    try {
      await addItemToCart(product._id, quantity);
      // Optionally show success message
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
        await removeItemFromWishlist(product._id);
      } else {
        await addItemToWishlist(product._id);
      }
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // Could show a toast notification here
    }
  };

  if (loading) {
    return (
      <>
        <NavBar />
        <Container sx={{ 
          py: { xs: 4, sm: 6, md: 8 }, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '50vh'
        }}>
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
        <Container sx={{ py: { xs: 4, sm: 6, md: 8 } }}>
          <Alert 
            severity="error" 
            sx={{ 
              maxWidth: 600, 
              mx: 'auto',
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}
          >
            {error || 'Product not found'}
          </Alert>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <NavBar />
      <Container 
        maxWidth="lg"
        sx={{ 
          py: { xs: 2, sm: 3, md: 4 }, 
          px: { xs: 1, sm: 2 },
          minHeight: "80vh" 
        }}
      >
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {/* Product Images */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper elevation={2} sx={{ p: { xs: 1.5, sm: 2 } }}>
              <CardMedia
                component="img"
                image={(product.images && product.images.length > 0) ? product.images[selectedImage] : '/placeholder-image.jpg'}
                alt={product.name}
                sx={{ 
                  borderRadius: 1, 
                  mb: 2,
                  height: { xs: 300, sm: 350, md: 400 },
                  objectFit: 'cover'
                }}
              />
              {product.images && product.images.length > 1 && (
                <Grid container spacing={1}>
                  {product.images.map((image: string, index: number) => (
                    <Grid size={{ xs: 3 }} key={index}>
                      <CardMedia
                        component="img"
                        image={image}
                        alt={`${product.name} view ${index + 1}`}
                        onClick={() => setSelectedImage(index)}
                        sx={{
                          borderRadius: 1,
                          cursor: "pointer",
                          height: { xs: 60, sm: 70, md: 80 },
                          objectFit: 'cover',
                          border: selectedImage === index ? 2 : 1,
                          borderColor: selectedImage === index ? "primary.main" : "grey.300",
                          transition: 'all 0.2s ease',
                          "&:hover": {
                            borderColor: "primary.main",
                            transform: 'scale(1.05)'
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
            <Box sx={{ px: { xs: 1, sm: 2, md: 0 } }}>
              <Typography 
                variant="h4" 
                component="h1" 
                gutterBottom
                sx={{
                  fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
                  fontWeight: 'bold',
                  mb: { xs: 2, sm: 3 }
                }}
              >
                {product.name}
              </Typography>

              {product.category && (
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    color: "text.secondary", 
                    mb: 2,
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    fontWeight: 500
                  }}
                >
                  Category: {product.category.name}
                </Typography>
              )}

              <Box sx={{ display: "flex", alignItems: "center", mb: { xs: 2, sm: 3 } }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: "primary.main", 
                    fontWeight: "bold",
                    fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
                  }}
                >
                  ${product.price?.toLocaleString()}
                </Typography>
              </Box>

              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 3, 
                  color: "text.secondary",
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  lineHeight: 1.6
                }}
              >
                {product.description}
              </Typography>

              <Divider sx={{ mb: { xs: 2, sm: 3 } }} />

              {/* Quantity and Add to Cart */}
              <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                <Typography 
                  variant="subtitle1" 
                  gutterBottom
                  sx={{
                    fontSize: { xs: '1rem', sm: '1.125rem' },
                    fontWeight: 600,
                    mb: 1.5
                  }}
                >
                  Quantity
                </Typography>
                <Box 
                  sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    mb: { xs: 2, sm: 3 },
                    gap: 1
                  }}
                >
                  <IconButton 
                    onClick={() => handleQuantityChange(-1)} 
                    disabled={quantity <= 1}
                    size={window.innerWidth < 600 ? "small" : "medium"}
                    sx={{
                      border: 1,
                      borderColor: 'divider',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'primary.main',
                        color: 'white'
                      }
                    }}
                  >
                    <Remove fontSize="small" />
                  </IconButton>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      minWidth: { xs: 40, sm: 60 }, 
                      textAlign: 'center',
                      fontSize: { xs: '1rem', sm: '1.125rem' },
                      fontWeight: 600,
                      px: 2,
                      py: 1,
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 1
                    }}
                  >
                    {quantity}
                  </Typography>
                  <IconButton 
                    onClick={() => handleQuantityChange(1)}
                    size={window.innerWidth < 600 ? "small" : "medium"}
                    sx={{
                      border: 1,
                      borderColor: 'divider',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'primary.main',
                        color: 'white'
                      }
                    }}
                  >
                    <Add fontSize="small" />
                  </IconButton>
                </Box>

                <Box 
                  sx={{ 
                    display: 'flex', 
                    gap: { xs: 1, sm: 2 }, 
                    mb: 3,
                    flexDirection: { xs: 'column', sm: 'row' }
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth={window.innerWidth < 600}
                    onClick={handleAddToCart}
                    startIcon={<ShoppingCart />}
                    sx={{
                      py: { xs: 1.5, sm: 2 },
                      px: { xs: 3, sm: 4 },
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      fontWeight: 600,
                      flex: { xs: 'none', sm: 1 }
                    }}
                  >
                    Add to Cart
                  </Button>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    gap: { xs: 1, sm: 2 },
                    justifyContent: { xs: 'center', sm: 'flex-start' }
                  }}>
                    <IconButton
                      onClick={handleAddToWishlist}
                      size="large"
                      sx={{
                        border: 1,
                        borderColor: 'divider',
                        color: isInWishlist(product._id) ? 'secondary.main' : 'text.secondary',
                        '&:hover': {
                          borderColor: 'secondary.main',
                          color: 'secondary.main'
                        }
                      }}
                    >
                      {isInWishlist(product._id) ? <Favorite /> : <FavoriteBorder />}
                    </IconButton>
                    
                    <IconButton
                      onClick={handleShare}
                      size="large"
                      sx={{
                        border: 1,
                        borderColor: 'divider',
                        '&:hover': {
                          borderColor: 'primary.main',
                          color: 'primary.main'
                        }
                      }}
                    >
                      <Share />
                    </IconButton>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ mb: { xs: 2, sm: 3 } }} />

              {/* Features */}
              <Box>
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{
                    fontSize: { xs: '1rem', sm: '1.125rem' },
                    fontWeight: 600,
                    mb: 2
                  }}
                >
                  Why Choose This Product?
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {features.map((feature, index) => (
                    <Box 
                      key={index} 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1.5 
                      }}
                    >
                      <Box sx={{ 
                        color: 'secondary.main',
                        '& svg': { fontSize: { xs: 20, sm: 24 } }
                      }}>
                        {feature.icon}
                      </Box>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'text.secondary',
                          fontSize: { xs: '0.875rem', sm: '1rem' }
                        }}
                      >
                        {feature.text}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
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
