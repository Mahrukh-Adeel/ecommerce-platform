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
  ListItemSecondaryAction,
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
      <Container maxWidth="lg" sx={{ mt: 4, mb: 6, flex: 1 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Shopping Cart
        </Typography>

        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            onClose={clearError}
          >
            {error}
          </Alert>
        )}

        {!cart || cart.items.length === 0 ? (
          <Paper elevation={2} sx={{ p: 6, textAlign: 'center' }}>
            <ShoppingCart sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Your cart is empty
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Add some items to your cart to get started.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/products')}
              size="large"
            >
              Shop Now
            </Button>
          </Paper>
        ) : (
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Cart Items ({getTotalItems()})
              </Typography>
              <Button
                color="error"
                startIcon={<Delete />}
                onClick={handleClearCart}
                disabled={isLoading}
              >
                Clear Cart
              </Button>
            </Box>

            <List>
              {cart.items.map((item, index) => (
                <React.Fragment key={item._id}>
                  <ListItem>
                    <ListItemText
                      primary={item.productId.name}
                      secondary={
                        <>
                          <Typography component="span" variant="body2">
                            Price: ${item.productId.price}
                          </Typography>
                          <br />
                          <Typography component="span" variant="body2">
                            Quantity: {item.quantity}
                          </Typography>
                          <br />
                          <Typography component="span" variant="body2" color="primary">
                            Subtotal: ${(item.productId.price * item.quantity).toFixed(2)}
                          </Typography>
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton
                          onClick={() => handleQuantityChange(item.productId._id, item.quantity - 1)}
                          disabled={isLoading}
                          size="small"
                        >
                          <Remove />
                        </IconButton>
                        <Typography sx={{ minWidth: 30, textAlign: 'center' }}>
                          {item.quantity}
                        </Typography>
                        <IconButton
                          onClick={() => handleQuantityChange(item.productId._id, item.quantity + 1)}
                          disabled={isLoading}
                          size="small"
                        >
                          <Add />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveItem(item.productId._id)}
                          disabled={isLoading}
                          sx={{ ml: 2 }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < cart.items.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">
                Total: ${getTotalPrice().toFixed(2)}
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/checkout')}
                disabled={isLoading}
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