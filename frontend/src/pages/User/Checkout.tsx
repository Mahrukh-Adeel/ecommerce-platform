import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  List,
  ListItem,
  ListItemText,
  Alert,
  CircularProgress,
} from '@mui/material';
import { 
  CreditCard, 
  LocalShipping, 
  Security,
  ArrowBack
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { useOrderStore } from '../../store/orderStore';
import type { ShippingAddress } from '../../models/Order';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, updateProfile } = useAuthStore();
  const { cart, getTotalPrice, clearCartItems } = useCartStore();
  const { createOrder, isLoading, error, clearError } = useOrderStore();

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: user?.name || '',
    streetAddress: user?.address || '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: user?.phone || '',
  });

  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressChanged, setAddressChanged] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (!cart || cart.items.length === 0) {
      navigate('/cart');
      return;
    }

    if (user?.address) {
      const addressParts = user.address.split(', ');
      if (addressParts.length >= 3) {
        setShippingAddress(prev => ({
          ...prev,
          streetAddress: addressParts[0] || '',
          city: addressParts[1] || '',
          state: addressParts[2] || '',
          zipCode: addressParts[3] || '',
        }));
      }
    }
  }, [isLoggedIn, cart, navigate, user]);

  const handleAddressChange = (field: keyof ShippingAddress) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setShippingAddress(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    
    if (field === 'streetAddress' || field === 'city' || field === 'state' || field === 'zipCode') {
      setAddressChanged(true);
    }
  };

  const handleSubmitOrder = async () => {
    if (!cart || !user) return;

    setIsSubmitting(true);
    clearError();

    try {
      if (addressChanged || shippingAddress.phone !== user.phone) {
        const addressString = `${shippingAddress.streetAddress}, ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}`;
        
        await updateProfile({
          address: addressString,
          phone: shippingAddress.phone,
        });
      }

      const orderData = {
        products: cart.items.map(item => ({
          productId: item.productId._id,
          quantity: item.quantity,
        })),
        address: `${shippingAddress.fullName}, ${shippingAddress.streetAddress}, ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}, ${shippingAddress.country}. Phone: ${shippingAddress.phone}`,
        paymentMethod,
      };

      await createOrder(orderData);
      await clearCartItems();
      
      // Redirect to order confirmation page
      navigate('/order-confirmation/latest');
      
    } catch (error) {
      console.error('Order creation failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = () => {
    return (
      shippingAddress.fullName &&
      shippingAddress.streetAddress &&
      shippingAddress.city &&
      shippingAddress.state &&
      shippingAddress.zipCode &&
      shippingAddress.phone &&
      paymentMethod
    );
  };

  if (!isLoggedIn || !cart || cart.items.length === 0) {
    return null;
  }

  return (
    <>
      <NavBar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/cart')}
          sx={{ mb: 3 }}
        >
          Back to Cart
        </Button>

        <Typography variant="h4" component="h1" gutterBottom>
          Checkout
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={clearError}>
            {error}
          </Alert>
        )}

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 8 }} >
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <LocalShipping sx={{ mr: 1 }} />
                Shipping Information
              </Typography>
              
              {user?.address && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Using saved address from your profile. You can modify it below if needed.
                </Alert>
              )}
              
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }} >
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={shippingAddress.fullName}
                    onChange={handleAddressChange('fullName')}
                    required
                    disabled
                    helperText="From your profile"
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Street Address"
                    value={shippingAddress.streetAddress}
                    onChange={handleAddressChange('streetAddress')}
                    required
                    placeholder="Enter your street address"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="City"
                    value={shippingAddress.city}
                    onChange={handleAddressChange('city')}
                    required
                    placeholder="Enter your city"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <TextField
                    fullWidth
                    label="State"
                    value={shippingAddress.state}
                    onChange={handleAddressChange('state')}
                    required
                    placeholder="State"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <TextField
                    fullWidth
                    label="ZIP Code"
                    value={shippingAddress.zipCode}
                    onChange={handleAddressChange('zipCode')}
                    required
                    placeholder="ZIP"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={shippingAddress.phone}
                    onChange={handleAddressChange('phone')}
                    required
                    placeholder="Enter your phone number"
                    helperText={user?.phone ? "From your profile" : "Will be saved to your profile"}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Country"
                    value={shippingAddress.country}
                    onChange={handleAddressChange('country')}
                    disabled
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Payment Method */}
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <CreditCard sx={{ mr: 1 }} />
                Payment Method
              </Typography>
              
              <FormControl component="fieldset">
                <RadioGroup
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <FormControlLabel
                    value="credit_card"
                    control={<Radio />}
                    label="Credit Card"
                  />
                  <FormControlLabel
                    value="cash_on_delivery"
                    control={<Radio />}
                    label="Cash on Delivery"
                  />
                </RadioGroup>
              </FormControl>

              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  This is a demo checkout. No actual payment will be processed.
                </Typography>
              </Alert>
            </Paper>
          </Grid>

          {/* Order Summary */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper elevation={2} sx={{ p: 3, position: 'sticky', top: 20 }}>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              
              <List dense>
                {cart.items.map((item) => (
                  <ListItem key={item._id} sx={{ px: 0 }}>
                    <ListItemText
                      primary={item.productId.name}
                      secondary={`Qty: ${item.quantity}`}
                    />
                    <Typography variant="body2">
                      ${(item.productId.price * item.quantity).toFixed(2)}
                    </Typography>
                  </ListItem>
                ))}
              </List>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body1">Subtotal:</Typography>
                <Typography variant="body1">${getTotalPrice().toFixed(2)}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body1">Shipping:</Typography>
                <Typography variant="body1" color="success.main">Free</Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" color="primary.main">
                  ${getTotalPrice().toFixed(2)}
                </Typography>
              </Box>

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleSubmitOrder}
                disabled={!validateForm() || isSubmitting || isLoading}
                startIcon={isSubmitting ? <CircularProgress size={20} /> : <Security />}
              >
                {isSubmitting ? 'Processing...' : 'Place Order'}
              </Button>

              <Typography variant="caption" display="block" sx={{ mt: 2, textAlign: 'center' }}>
                By placing this order, you agree to our terms and conditions.
              </Typography>

              {(addressChanged || shippingAddress.phone !== user?.phone) && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="caption">
                    Your address and phone number will be saved to your profile.
                  </Typography>
                </Alert>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

export default CheckoutPage;