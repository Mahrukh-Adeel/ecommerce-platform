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
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';
import { 
  CreditCard, 
  Security,
  ArrowBack,
  Lock
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import NavBar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { useOrderStore } from '../../store/orderStore';
import type { CreditCardInfo, CheckoutData } from '../../types/payment';
import { 
  validateCreditCardForm,
  formatCardNumber,
  getCardType
} from '../../utils/creditCardValidation';

const CreditCardDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoggedIn } = useAuthStore();
  const { cart, getTotalPrice, clearCartItems } = useCartStore();
  const { createOrder, isLoading, error, clearError } = useOrderStore();

  const checkoutData = location.state as CheckoutData;

  const [creditCardInfo, setCreditCardInfo] = useState<CreditCardInfo>({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: user?.name || '',
    billingAddress: {
      streetAddress: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA',
    },
  });

  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (!cart || cart.items.length === 0) {
      navigate('/cart');
      return;
    }

    if (!checkoutData) {
      navigate('/checkout');
      return;
    }

    if (sameAsShipping && checkoutData?.shippingAddress) {
      setCreditCardInfo(prev => ({
        ...prev,
        billingAddress: {
          streetAddress: checkoutData.shippingAddress.streetAddress,
          city: checkoutData.shippingAddress.city,
          state: checkoutData.shippingAddress.state,
          zipCode: checkoutData.shippingAddress.zipCode,
          country: checkoutData.shippingAddress.country,
        },
      }));
    }
  }, [isLoggedIn, cart, navigate, checkoutData, sameAsShipping]);

  const handleInputChange = (field: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setCreditCardInfo(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof CreditCardInfo] as Record<string, string>),
          [child]: event.target.value,
        },
      }));
    } else {
      setCreditCardInfo(prev => ({
        ...prev,
        [field]: event.target.value,
      }));
    }
  };

  const handleCardNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(event.target.value);
    setCreditCardInfo(prev => ({
      ...prev,
      cardNumber: formatted,
    }));
  };

  const handleSubmitPayment = async () => {
    if (!checkoutData || !user) return;

    setIsSubmitting(true);
    clearError();

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const orderDataWithPayment = {
        ...checkoutData.orderData,
        paymentDetails: {
          method: 'credit_card',
          cardLastFour: creditCardInfo.cardNumber.replace(/\D/g, '').slice(-4),
          cardType: getCardType(creditCardInfo.cardNumber),
        },
      };

      await createOrder(orderDataWithPayment);
      await clearCartItems();
      
      navigate('/order-confirmation/latest');
      
    } catch (error) {
      console.error('Payment processing failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = () => {
    return validateCreditCardForm(creditCardInfo, sameAsShipping);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear + i);
  const months = [
    { value: '01', label: '01 - January' },
    { value: '02', label: '02 - February' },
    { value: '03', label: '03 - March' },
    { value: '04', label: '04 - April' },
    { value: '05', label: '05 - May' },
    { value: '06', label: '06 - June' },
    { value: '07', label: '07 - July' },
    { value: '08', label: '08 - August' },
    { value: '09', label: '09 - September' },
    { value: '10', label: '10 - October' },
    { value: '11', label: '11 - November' },
    { value: '12', label: '12 - December' },
  ];

  if (!isLoggedIn || !cart || cart.items.length === 0 || !checkoutData) {
    return null;
  }

  return (
    <>
      <NavBar />
      <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/checkout')}
          sx={{ mb: 3 }}
        >
          Back to Checkout
        </Button>

        <Typography variant="h4" component="h1" gutterBottom>
          Credit Card Details
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={clearError}>
            {error}
          </Alert>
        )}

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <CreditCard sx={{ mr: 1 }} />
                Payment Information
              </Typography>

              <Alert severity="info" sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Lock sx={{ mr: 1, fontSize: 16 }} />
                  <Typography variant="body2">
                    This is a demo payment form. No actual payment will be processed.
                  </Typography>
                </Box>
              </Alert>
              
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Card Number"
                    value={creditCardInfo.cardNumber}
                    onChange={handleCardNumberChange}
                    required
                    placeholder="1234 5678 9012 3456"
                    inputProps={{ maxLength: 19 }}
                  />
                </Grid>
                
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Cardholder Name"
                    value={creditCardInfo.cardholderName}
                    onChange={handleInputChange('cardholderName')}
                    required
                    placeholder="John Doe"
                  />
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <FormControl fullWidth required>
                    <InputLabel>Expiry Month</InputLabel>
                    <Select
                      value={creditCardInfo.expiryMonth}
                      onChange={(e) => setCreditCardInfo(prev => ({
                        ...prev,
                        expiryMonth: e.target.value as string,
                      }))}
                      label="Expiry Month"
                    >
                      {months.map((month) => (
                        <MenuItem key={month.value} value={month.value}>
                          {month.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <FormControl fullWidth required>
                    <InputLabel>Expiry Year</InputLabel>
                    <Select
                      value={creditCardInfo.expiryYear}
                      onChange={(e) => setCreditCardInfo(prev => ({
                        ...prev,
                        expiryYear: e.target.value as string,
                      }))}
                      label="Expiry Year"
                    >
                      {years.map((year) => (
                        <MenuItem key={year} value={year.toString()}>
                          {year}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    label="CVV"
                    value={creditCardInfo.cvv}
                    onChange={handleInputChange('cvv')}
                    required
                    placeholder="123"
                    inputProps={{ maxLength: 4 }}
                    type="password"
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Billing Address */}
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Billing Address
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Button
                  variant={sameAsShipping ? 'contained' : 'outlined'}
                  onClick={() => setSameAsShipping(!sameAsShipping)}
                  size="small"
                >
                  {sameAsShipping ? 'Same as shipping address' : 'Use different billing address'}
                </Button>
              </Box>

              {!sameAsShipping && (
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Street Address"
                      value={creditCardInfo.billingAddress.streetAddress}
                      onChange={handleInputChange('billingAddress.streetAddress')}
                      required
                      placeholder="123 Main St"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="City"
                      value={creditCardInfo.billingAddress.city}
                      onChange={handleInputChange('billingAddress.city')}
                      required
                      placeholder="New York"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 3 }}>
                    <TextField
                      fullWidth
                      label="State"
                      value={creditCardInfo.billingAddress.state}
                      onChange={handleInputChange('billingAddress.state')}
                      required
                      placeholder="NY"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 3 }}>
                    <TextField
                      fullWidth
                      label="ZIP Code"
                      value={creditCardInfo.billingAddress.zipCode}
                      onChange={handleInputChange('billingAddress.zipCode')}
                      required
                      placeholder="10001"
                    />
                  </Grid>
                </Grid>
              )}
            </Paper>
          </Grid>

          {/* Order Summary */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card elevation={2} sx={{ position: 'sticky', top: 20 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Order Summary
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  {cart.items.slice(0, 3).map((item) => (
                    <Box key={item._id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" noWrap sx={{ maxWidth: '60%' }}>
                        {item.productId.name} × {item.quantity}
                      </Typography>
                      <Typography variant="body2">
                        ${(item.productId.price * item.quantity).toFixed(2)}
                      </Typography>
                    </Box>
                  ))}
                  {cart.items.length > 3 && (
                    <Typography variant="body2" color="text.secondary">
                      +{cart.items.length - 3} more items
                    </Typography>
                  )}
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                  <Typography variant="h6">Total:</Typography>
                  <Typography variant="h6" color="primary.main">
                    ${getTotalPrice().toFixed(2)}
                  </Typography>
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleSubmitPayment}
                  disabled={!validateForm() || isSubmitting || isLoading}
                  startIcon={isSubmitting ? <CircularProgress size={20} /> : <Security />}
                >
                  {isSubmitting ? 'Processing Payment...' : `Pay $${getTotalPrice().toFixed(2)}`}
                </Button>

                <Typography variant="caption" display="block" sx={{ mt: 2, textAlign: 'center' }}>
                  <Lock sx={{ fontSize: 12, mr: 0.5 }} />
                  Your payment information is secure and encrypted.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

export default CreditCardDetailsPage;