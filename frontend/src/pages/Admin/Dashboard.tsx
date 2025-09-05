import React, { useState, useEffect } from "react";
import {
  Box,
  CssBaseline,
  Container,
  Toolbar,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Divider,
  Stack,
  Chip,
} from "@mui/material";
import {
  Add,
  Inventory,
  ShoppingCart,
  People,
  TrendingUp,
  ArrowForward,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import AdminAppBar from "./components/AdminAppBar";
import AdminSidebar from "./components/AdminSidebar";
import { useAdminStore } from "../../store/adminStore";

const drawerWidth = 240;

const Dashboard: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const { orders, products, fetchAllOrders, fetchAllProducts } = useAdminStore();

  useEffect(() => {
    fetchAllOrders();
    fetchAllProducts();
  }, [fetchAllOrders, fetchAllProducts]);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const totalOrders = orders.length;
  const totalProducts = products.length;
  const pendingOrders = orders.filter(order => order.status === 'placed' || order.status === 'processing').length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'placed':
        return 'primary';
      case 'processing':
        return 'warning';
      case 'shipped':
        return 'info';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AdminAppBar
        drawerWidth={drawerWidth}
        onMenuClick={handleDrawerToggle}
        anchorEl={anchorEl}
        onProfileMenuOpen={handleProfileMenuOpen}
        onProfileMenuClose={handleProfileMenuClose}
      />
      <AdminSidebar
        drawerWidth={drawerWidth}
        mobileOpen={mobileOpen}
        onDrawerClose={handleDrawerClose}
        onDrawerTransitionEnd={handleDrawerTransitionEnd}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        <Toolbar />
        <Container maxWidth="xl">
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
              Dashboard Overview
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Welcome back! Here's what's happening with your store today.
            </Typography>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ height: '100%', transition: 'all 0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 } }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                    <Stack spacing={1}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Total Orders
                      </Typography>
                      <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        {totalOrders}
                      </Typography>
                    </Stack>
                    <Box 
                      sx={{ 
                        p: 2, 
                        borderRadius: 2, 
                        bgcolor: 'primary.light', 
                        color: 'primary.contrastText',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <ShoppingCart sx={{ fontSize: 32 }} />
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ height: '100%', transition: 'all 0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 } }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                    <Stack spacing={1}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Total Products
                      </Typography>
                      <Typography variant="h3" sx={{ fontWeight: 700, color: 'success.main' }}>
                        {totalProducts}
                      </Typography>
                    </Stack>
                    <Box 
                      sx={{ 
                        p: 2, 
                        borderRadius: 2, 
                        bgcolor: 'success.light', 
                        color: 'success.contrastText',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Inventory sx={{ fontSize: 32 }} />
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ height: '100%', transition: 'all 0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 } }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                    <Stack spacing={1}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Pending Orders
                      </Typography>
                      <Typography variant="h3" sx={{ fontWeight: 700, color: 'warning.main' }}>
                        {pendingOrders}
                      </Typography>
                    </Stack>
                    <Box 
                      sx={{ 
                        p: 2, 
                        borderRadius: 2, 
                        bgcolor: 'warning.light', 
                        color: 'warning.contrastText',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <People sx={{ fontSize: 32 }} />
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ height: '100%', transition: 'all 0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 } }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                    <Stack spacing={1}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Total Revenue
                      </Typography>
                      <Typography variant="h3" sx={{ fontWeight: 700, color: 'info.main' }}>
                        ${totalRevenue.toFixed(2)}
                      </Typography>
                    </Stack>
                    <Box 
                      sx={{ 
                        p: 2, 
                        borderRadius: 2, 
                        bgcolor: 'info.light', 
                        color: 'info.contrastText',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <TrendingUp sx={{ fontSize: 32 }} />
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Quick Actions and Recent Activity */}
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 4, 
                  height: '100%',
                  borderRadius: 3,
                  transition: 'all 0.2s',
                  '&:hover': { boxShadow: 4 }
                }}
              >
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                    Quick Actions
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Common tasks and shortcuts to manage your store
                  </Typography>
                </Box>
                
                <Divider sx={{ mb: 3 }} />
                
                <Stack spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<Add />}
                    endIcon={<ArrowForward />}
                    onClick={() => navigate("/admin/add-products")}
                    fullWidth
                    sx={{ 
                      py: 1.5, 
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '1rem'
                    }}
                  >
                    Add New Product
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<ShoppingCart />}
                    endIcon={<ArrowForward />}
                    onClick={() => navigate("/admin/manage-orders")}
                    fullWidth
                    sx={{ 
                      py: 1.5, 
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '1rem'
                    }}
                  >
                    Manage Orders
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<Inventory />}
                    endIcon={<ArrowForward />}
                    onClick={() => navigate("/admin/manage-products")}
                    fullWidth
                    sx={{ 
                      py: 1.5, 
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '1rem'
                    }}
                  >
                    View All Products
                  </Button>
                </Stack>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 4, 
                  height: '100%',
                  borderRadius: 3,
                  transition: 'all 0.2s',
                  '&:hover': { boxShadow: 4 }
                }}
              >
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                    Recent Activity
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Latest orders and recent activities
                  </Typography>
                </Box>
                
                <Divider sx={{ mb: 3 }} />
                
                <Stack spacing={2}>
                  {orders.slice(0, 5).map((order) => (
                    <Paper 
                      key={order._id} 
                      variant="outlined"
                      sx={{ 
                        p: 2.5, 
                        borderRadius: 2,
                        transition: 'all 0.2s',
                        '&:hover': { 
                          bgcolor: 'action.hover',
                          borderColor: 'primary.main'
                        }
                      }}
                    >
                      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                        <Stack spacing={0.5} sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            Order #{order._id?.slice(-8).toUpperCase()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(order.createdAt || '').toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'success.main' }}>
                            ${order.total.toFixed(2)}
                          </Typography>
                          <Chip 
                            label={order.status}
                            size="small"
                            color={getStatusColor(order.status)}
                            sx={{ 
                              textTransform: 'capitalize',
                              fontWeight: 500,
                              minWidth: 80
                            }}
                          />
                        </Stack>
                      </Stack>
                    </Paper>
                  ))}
                  {orders.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        No recent orders to display
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;