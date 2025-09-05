import React, { useState, useEffect } from "react";
import {
  Box,
  CssBaseline,
  Container,
  Toolbar,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemText,
  Grid,
} from "@mui/material";
import {
  Visibility,
  Edit,
} from "@mui/icons-material";
import AdminAppBar from "./components/AdminAppBar";
import AdminSidebar from "./components/AdminSidebar";
import { useAdminStore } from "../../store/adminStore";
import type { Order } from "../../models/Order";

const drawerWidth = 240;

const ManageOrders: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  const {
    orders,
    isLoadingOrders,
    ordersError,
    successMessage,
    fetchAllOrders,
    updateOrderStatus,
    clearErrors,
    clearSuccess,
  } = useAdminStore();

  useEffect(() => {
    // Clear any existing success/error messages when component mounts
    clearErrors();
    clearSuccess();
    
    fetchAllOrders();
  }, [fetchAllOrders, clearErrors, clearSuccess]);

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

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setViewDialogOpen(true);
  };

  const handleEditStatus = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setStatusDialogOpen(true);
  };

  const handleStatusUpdate = async () => {
    if (selectedOrder && newStatus) {
      clearErrors();
      clearSuccess();
      await updateOrderStatus(selectedOrder._id!, newStatus);
      setStatusDialogOpen(false);
      setSelectedOrder(null);
    }
  };

  if (isLoadingOrders) {
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
        <Box component="main" sx={{ flexGrow: 1, p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <CircularProgress size={60} />
        </Box>
      </Box>
    );
  }

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
          <Paper sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>
              Manage Orders
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              View and manage all customer orders
            </Typography>

            {successMessage && (
              <Alert 
                severity="success" 
                onClose={clearSuccess}
                sx={{ mb: 3, borderRadius: 2 }}
              >
                {successMessage}
              </Alert>
            )}

            {ordersError && (
              <Alert 
                severity="error" 
                onClose={clearErrors}
                sx={{ mb: 3, borderRadius: 2 }}
              >
                {ordersError}
              </Alert>
            )}

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Items</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell>#{order._id?.slice(-8).toUpperCase()}</TableCell>
                      <TableCell>
                        {typeof order.userId === 'object' && order.userId?.name ? order.userId.name : 'N/A'}
                      </TableCell>
                      <TableCell>{order.products?.length || 0} items</TableCell>
                      <TableCell>${order.total?.toFixed(2)}</TableCell>
                      <TableCell>
                        <Chip
                          label={order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                          color={getStatusColor(order.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(order.createdAt || '').toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Button
                            size="small"
                            startIcon={<Visibility />}
                            onClick={() => handleViewOrder(order)}
                          >
                            View
                          </Button>
                          <Button
                            size="small"
                            startIcon={<Edit />}
                            onClick={() => handleEditStatus(order)}
                          >
                            Status
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {orders.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary">
                  No orders found
                </Typography>
              </Box>
            )}
          </Paper>
        </Container>

        {/* View Order Dialog */}
        <Dialog 
          open={viewDialogOpen} 
          onClose={() => setViewDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Order Details - #{selectedOrder?._id?.slice(-8).toUpperCase()}
          </DialogTitle>
          <DialogContent>
            {selectedOrder && (
              <Grid container spacing={3}>
                <Grid size={{xs:12, md:6}} >
                  <Typography variant="h6" gutterBottom>Customer Information</Typography>
                  <Typography><Box component="span" fontWeight="bold">Name:</Box> {typeof selectedOrder.userId === 'object' && selectedOrder.userId?.name ? selectedOrder.userId.name : 'N/A'}</Typography>
                  <Typography><Box component="span" fontWeight="bold">Email:</Box> {typeof selectedOrder.userId === 'object' && selectedOrder.userId?.email ? selectedOrder.userId.email : 'N/A'}</Typography>
                  <Typography><Box component="span" fontWeight="bold">Address:</Box> {selectedOrder.address}</Typography>
                </Grid>

                <Grid size={{xs:12, md:6}} >
                  <Typography variant="h6" gutterBottom>Order Information</Typography>
                  <Typography><Box component="span" fontWeight="bold">Status:</Box> 
                    <Chip
                      label={selectedOrder.status?.charAt(0).toUpperCase() + selectedOrder.status?.slice(1)}
                      color={getStatusColor(selectedOrder.status)}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Typography>
                  <Typography><Box component="span" fontWeight="bold">Payment Method:</Box> {selectedOrder.paymentMethod?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</Typography>
                  <Typography><Box component="span" fontWeight="bold">Total:</Box> ${selectedOrder.total?.toFixed(2)}</Typography>
                  <Typography><Box component="span" fontWeight="bold">Date:</Box> {new Date(selectedOrder.createdAt || '').toLocaleString()}</Typography>
                </Grid>

                <Grid size={{xs:12, md:6}} >
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>Order Items</Typography>
                  <List>
                    {selectedOrder.products?.map((item, index) => (
                      <ListItem key={index} divider>
                        <ListItemText
                          primary={item.productId?.name || 'Unknown Product'}
                          secondary={`Quantity: ${item.quantity} × $${item.productId?.price?.toFixed(2) || '0.00'}`}
                        />
                        <Typography variant="body1">
                          ${((item.productId?.price || 0) * item.quantity).toFixed(2)}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Status Update Dialog */}
        <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)}>
          <DialogTitle>Update Order Status</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                label="Status"
              >
                <MenuItem value="placed">Placed</MenuItem>
                <MenuItem value="processing">Processing</MenuItem>
                <MenuItem value="shipped">Shipped</MenuItem>
                <MenuItem value="delivered">Delivered</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleStatusUpdate} variant="contained">Update</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default ManageOrders;
