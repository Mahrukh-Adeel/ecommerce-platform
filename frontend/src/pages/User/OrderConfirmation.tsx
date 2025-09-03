import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Divider,
  Button,
  List,
  ListItem,
  ListItemText,
  Chip,
  Avatar,
} from '@mui/material';
import {
  CheckCircle,
  LocalShipping,
  Payment,
  Receipt,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useOrderStore } from '../../store/orderStore';
import { useAuthStore } from '../../store/authStore';
import type { Order } from '../../models/Order';

const OrderConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useAuthStore();
  const { currentOrder, fetchOrderById, isLoading } = useOrderStore();
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Handle order initialization only once
  useEffect(() => {
    if (!hasInitialized) {
      if (orderId && orderId !== 'latest') {
        // Fetch specific order by ID (when coming from profile)
        fetchOrderById(orderId);
      } else if (currentOrder) {
        // Use current order (when coming from checkout)
        setOrderDetails(currentOrder);
      }
      setHasInitialized(true);
    }
  }, [orderId, currentOrder, hasInitialized]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update orderDetails when currentOrder changes
  useEffect(() => {
    if (currentOrder) {
      setOrderDetails(currentOrder);
    }
  }, [currentOrder]);

  const isNewOrder = !orderId || orderId === 'latest';

  if (isLoading) {
    return (
      <>
        <NavBar />
        <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
          <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6">Loading order details...</Typography>
          </Paper>
        </Container>
        <Footer />
      </>
    );
  }

  if (!orderDetails) {
    return (
      <>
        <NavBar />
        <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
          <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="error">
              Order not found
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => navigate('/profile')}
              sx={{ mt: 2 }}
            >
              Go to Profile
            </Button>
          </Paper>
        </Container>
        <Footer />
      </>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'placed': return 'warning';
      case 'processing': return 'info';
      case 'shipped': return 'primary';
      case 'delivered': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  return (
    <>
      <NavBar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
        {/* Header */}
        <Paper elevation={2} sx={{ p: 4, mb: 4, textAlign: 'center' }}>
          {isNewOrder ? (
            <>
              <CheckCircle color="success" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h4" color="success.main" gutterBottom>
                Order Placed Successfully!
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Thank you for your order, {user?.name}. Your order has been confirmed.
              </Typography>
            </>
          ) : (
            <>
              <Receipt sx={{ fontSize: 60, mb: 2, color: 'primary.main' }} />
              <Typography variant="h4" gutterBottom>
                Order Details
              </Typography>
            </>
          )}
          
          <Typography variant="h6" sx={{ mb: 1 }}>
            Order ID: #{orderDetails._id?.slice(-8).toUpperCase()}
          </Typography>
          
          <Chip 
            label={orderDetails.status?.toUpperCase()} 
            color={getStatusColor(orderDetails.status || 'placed')}
            sx={{ mb: 2 }}
          />
          
          <Typography variant="body2" color="text.secondary">
            Placed on {new Date(orderDetails.createdAt || '').toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Typography>
        </Paper>

        <Grid container spacing={4}>
          {/* Order Items */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Receipt sx={{ mr: 1 }} />
                Order Items
              </Typography>
              
              <List>
                {orderDetails.products?.map((item: {productId: {name?: string, price?: number, images?: string[]}, quantity: number}, index: number) => (
                  <React.Fragment key={index}>
                    <ListItem sx={{ px: 0 }}>
                      <Avatar 
                        src={item.productId?.images?.[0]} 
                        variant="rounded"
                        sx={{ width: 60, height: 60, mr: 2 }}
                      />
                      <ListItemText
                        primary={item.productId?.name || 'Unknown Product'}
                        secondary={`Quantity: ${item.quantity}`}
                      />
                      <Typography variant="h6">
                        ${((item.productId?.price || 0) * item.quantity).toFixed(2)}
                      </Typography>
                    </ListItem>
                    {index < (orderDetails.products?.length || 0) - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Subtotal:</Typography>
                <Typography variant="body1">${orderDetails.total?.toFixed(2)}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Shipping:</Typography>
                <Typography variant="body1" color="success.main">Free</Typography>
              </Box>
              
              <Divider sx={{ my: 1 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" color="primary.main">
                  ${orderDetails.total?.toFixed(2)}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Order Summary */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <LocalShipping sx={{ mr: 1 }} />
                Shipping Address
              </Typography>
              
              <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                {orderDetails.address}
              </Typography>
            </Paper>

            {/* Payment Method */}
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Payment sx={{ mr: 1 }} />
                Payment Method
              </Typography>
              
              <Typography variant="body2">
                {orderDetails.paymentMethod?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

export default OrderConfirmation;