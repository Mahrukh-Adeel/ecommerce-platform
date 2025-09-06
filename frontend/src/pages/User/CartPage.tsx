import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Add,
  Remove,
  Delete,
  ShoppingCart,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuthStore();
  const {
    cart,
    isLoading,
    error,
    getCart,
    updateItemQuantity,
    removeItemFromCart,
    clearCartItems,
    getTotalItems,
    getTotalPrice,
    clearError,
  } = useCartStore();

  useEffect(() => {
    if (isLoggedIn && user?.id) {
      getCart();
    }
  }, [isLoggedIn, user?.id, getCart]);

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      await removeItemFromCart(productId);
    } else {
      await updateItemQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    await removeItemFromCart(productId);
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      await clearCartItems();
    }
  };

  if (!isLoggedIn) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <NavBar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 6, flex: 1, display: 'flex', alignItems: 'center' }}>
          <Paper elevation={2} sx={{ p: 4, textAlign: 'center', width: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Please log in to view your cart
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              You need to be logged in to access your shopping cart.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/login')}
              sx={{ mr: 2 }}
            >
              Login
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </Button>
          </Paper>
        </Container>
        <Footer />
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <NavBar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 6, flex: 1, display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            <CircularProgress />
          </Box>
        </Container>
        <Footer />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavBar />
      <Container 
        maxWidth="lg" 
        sx={{ 
          mt: { xs: 2, sm: 3, md: 4 }, 
          mb: { xs: 4, sm: 5, md: 6 }, 
          flex: 1,
          px: { xs: 1, sm: 2 }
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{
            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
            textAlign: { xs: 'center', sm: 'left' },
            mb: { xs: 2, sm: 3 }
          }}
        >
          Shopping Cart
        </Typography>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              '& .MuiAlert-message': {
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }
            }}
            onClose={clearError}
          >
            {error}
          </Alert>
        )}

        {!cart || cart.items.length === 0 ? (
          <Paper 
            elevation={2} 
            sx={{ 
              p: { xs: 3, sm: 4, md: 6 }, 
              textAlign: 'center' 
            }}
          >
            <ShoppingCart 
              sx={{ 
                fontSize: { xs: 48, sm: 56, md: 60 }, 
                color: 'text.secondary', 
                mb: 2 
              }} 
            />
            <Typography 
              variant="h5" 
              gutterBottom
              sx={{ 
                fontSize: { xs: '1.25rem', sm: '1.5rem' } 
              }}
            >
              Your cart is empty
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ 
                mb: 3,
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              Add some items to your cart to get started.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/products')}
              size="large"
              sx={{ 
                px: { xs: 3, sm: 4 },
                py: { xs: 1, sm: 1.5 },
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              Shop Now
            </Button>
          </Paper>
        ) : (
          <Paper 
            elevation={2} 
            sx={{ 
              p: { xs: 2, sm: 3 } 
            }}
          >
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: { xs: 'flex-start', sm: 'center' },
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 2, sm: 0 },
                mb: 3 
              }}
            >
              <Typography 
                variant="h6"
                sx={{ 
                  fontSize: { xs: '1.125rem', sm: '1.25rem' } 
                }}
              >
                Cart Items ({getTotalItems()})
              </Typography>
              <Button
                color="error"
                startIcon={<Delete />}
                onClick={handleClearCart}
                disabled={isLoading}
                size={window.innerWidth < 600 ? "small" : "medium"}
                sx={{
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  alignSelf: { xs: 'flex-end', sm: 'auto' }
                }}
              >
                Clear Cart
              </Button>
            </Box>

            <List sx={{ px: 0 }}>
              {cart.items.map((item, index) => (
                <React.Fragment key={item._id}>
                  <ListItem 
                    sx={{ 
                      px: { xs: 0, sm: 2 },
                      py: { xs: 2, sm: 1.5 },
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'stretch', sm: 'flex-start' },
                      gap: { xs: 2, sm: 0 }
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography 
                          variant="h6"
                          sx={{ 
                            fontSize: { xs: '1rem', sm: '1.125rem' },
                            mb: 1
                          }}
                        >
                          {item.productId.name}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Typography 
                            component="span" 
                            variant="body2"
                            sx={{ fontSize: { xs: '0.875rem', sm: '0.875rem' } }}
                          >
                            Price: ${item.productId.price}
                          </Typography>
                          <Typography 
                            component="span" 
                            variant="body2"
                            sx={{ fontSize: { xs: '0.875rem', sm: '0.875rem' } }}
                          >
                            Quantity: {item.quantity}
                          </Typography>
                          <Typography 
                            component="span" 
                            variant="body2" 
                            color="primary"
                            sx={{ 
                              fontSize: { xs: '0.875rem', sm: '0.875rem' },
                              fontWeight: 600
                            }}
                          >
                            Subtotal: ${(item.productId.price * item.quantity).toFixed(2)}
                          </Typography>
                        </Box>
                      }
                      sx={{ 
                        flex: 1,
                        mr: { xs: 0, sm: 2 }
                      }}
                    />
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: { xs: 1, sm: 1.5 },
                        justifyContent: { xs: 'space-between', sm: 'flex-end' },
                        width: { xs: '100%', sm: 'auto' },
                        mt: { xs: 1, sm: 0 }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton
                          onClick={() => handleQuantityChange(item.productId._id, item.quantity - 1)}
                          disabled={isLoading}
                          size="small"
                          sx={{ 
                            minWidth: { xs: 32, sm: 40 },
                            minHeight: { xs: 32, sm: 40 }
                          }}
                        >
                          <Remove fontSize="small" />
                        </IconButton>
                        <Typography 
                          sx={{ 
                            minWidth: { xs: 24, sm: 30 }, 
                            textAlign: 'center',
                            fontSize: { xs: '0.875rem', sm: '1rem' },
                            fontWeight: 600,
                            px: 1
                          }}
                        >
                          {item.quantity}
                        </Typography>
                        <IconButton
                          onClick={() => handleQuantityChange(item.productId._id, item.quantity + 1)}
                          disabled={isLoading}
                          size="small"
                          sx={{ 
                            minWidth: { xs: 32, sm: 40 },
                            minHeight: { xs: 32, sm: 40 }
                          }}
                        >
                          <Add fontSize="small" />
                        </IconButton>
                      </Box>
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveItem(item.productId._id)}
                        disabled={isLoading}
                        sx={{ 
                          ml: { xs: 1, sm: 2 },
                          minWidth: { xs: 32, sm: 40 },
                          minHeight: { xs: 32, sm: 40 }
                        }}
                        size="small"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </ListItem>
                  {index < cart.items.length - 1 && <Divider sx={{ my: { xs: 1, sm: 0.5 } }} />}
                </React.Fragment>
              ))}
            </List>

            <Divider sx={{ my: { xs: 2, sm: 3 } }} />

            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: { xs: 'flex-start', sm: 'center' },
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 2, sm: 0 }
              }}
            >
              <Typography 
                variant="h6"
                sx={{
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                  fontWeight: 'bold',
                  color: 'primary.main'
                }}
              >
                Total: ${getTotalPrice().toFixed(2)}
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/checkout')}
                disabled={isLoading}
                sx={{
                  px: { xs: 4, sm: 6 },
                  py: { xs: 1.5, sm: 2 },
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  fontWeight: 600,
                  borderRadius: 2,
                  boxShadow: 2,
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-1px)'
                  },
                  alignSelf: { xs: 'stretch', sm: 'auto' }
                }}
              >
                Proceed to Checkout
              </Button>
            </Box>
          </Paper>
        )}
      </Container>
      <Footer />
    </Box>
  );
};

export default CartPage;