import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Avatar,
  Button,
  TextField,
  Divider,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tab,
  Tabs,
  Alert,
  Stack,
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  LocationOn,
  ShoppingBag,
  Settings,
  Save,
  Cancel,
  Google,
  Edit,
} from '@mui/icons-material';
import NavBar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useAuthStore } from '../../store/authStore';
import { useOrderStore } from '../../store/orderStore';
import { useNavigate } from 'react-router-dom';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuthStore();
  const { orders, fetchUserOrders, isLoading: ordersLoading } = useOrderStore();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');
  
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    joinDate: '',
    avatar: '',
    provider: 'local',
  });

  const [editInfo, setEditInfo] = useState({ ...userInfo });

  useEffect(() => {
    if (user?.id) {
      setUserInfo({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        joinDate: user.joinDate ? `Member since ${new Date(user.joinDate).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long' 
        })}` : 'Member since recently',
        avatar: user.avatar || '',
        provider: user.provider || 'local',
      });
      setEditInfo({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        joinDate: user.joinDate ? `Member since ${new Date(user.joinDate).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long' 
        })}` : 'Member since recently',
        avatar: user.avatar || '',
        provider: user.provider || 'local',
      });
    }
  }, [user]);

  // Separate effect for fetching orders to avoid dependency issues
  useEffect(() => {
    if (user?.id) {
      fetchUserOrders(user.id);
    }
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSave = async () => {
    if (!user) return;
    
    setIsUpdating(true);
    setUpdateMessage('');
    
    try {
      const updateData: {
        name?: string;
        email?: string;
        phone?: string;
        address?: string;
      } = {};
      
      if (editInfo.name !== userInfo.name) updateData.name = editInfo.name;
      if (editInfo.phone !== userInfo.phone) updateData.phone = editInfo.phone;
      if (editInfo.address !== userInfo.address) updateData.address = editInfo.address;
      
      if (userInfo.provider !== 'google' && editInfo.email !== userInfo.email) {
        updateData.email = editInfo.email;
      }

      if (Object.keys(updateData).length === 0) {
        setUpdateMessage('No changes to save');
        setIsEditing(false);
        return;
      }

      await updateProfile(updateData);
      
      setUserInfo({ ...editInfo });
      setIsEditing(false);
      setUpdateMessage('Profile updated successfully!');
      
      setTimeout(() => setUpdateMessage(''), 3000);
      
    } catch (error) {
      console.error('Failed to update profile:', error);
      setUpdateMessage(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setEditInfo({ ...userInfo });
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditInfo({ ...editInfo, [field]: value });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'success';
      case 'shipped':
        return 'primary';
      case 'processing':
        return 'info';
      case 'placed':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <>
      <NavBar />
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
        {!user ? (
          <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              Please log in to view your profile
            </Typography>
            <Typography variant="body1" color="text.secondary">
              You need to be logged in to access your profile information.
            </Typography>
          </Paper>
        ) : (
          <>
            {/* Header Section */}
            <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 12, md: 2 }}>
              <Avatar
                src={userInfo.provider === 'google' ? userInfo.avatar : undefined}
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: 'primary.main',
                  fontSize: '2rem',
                }}
              >
                {!userInfo.avatar && userInfo.name.split(' ').map(n => n[0]).join('')}
              </Avatar>
            </Grid>
            <Grid size={{ xs: 12, md: 7 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="h4" sx={{ color: 'primary.main' }}>
                  {userInfo.name}
                </Typography>
                {userInfo.provider === 'google' && (
                  <Chip
                    icon={<Google />}
                    label="Google Account"
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                )}
              </Box>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {userInfo.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {userInfo.joinDate}
              </Typography>
              {user?.isVerified && (
                <Chip
                  label="Verified Account"
                  size="small"
                  color="success"
                  sx={{ mt: 1 }}
                />
              )}
            </Grid>
            <Grid>
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={handleEdit}
                sx={{ bgcolor: '#8A9A5B', '&:hover': { bgcolor: '#7A8A4B' } }}
              >
                Edit Profile
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Tabs */}
        <Paper elevation={2}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="profile tabs">
              <Tab
                icon={<Person />}
                label="Personal Info"
                iconPosition="start"
                sx={{ minHeight: 64 }}
              />
              <Tab
                icon={<ShoppingBag />}
                label="Order History"
                iconPosition="start"
                sx={{ minHeight: 64 }}
              />
              <Tab
                icon={<Settings />}
                label="Settings"
                iconPosition="start"
                sx={{ minHeight: 64 }}
              />
            </Tabs>
          </Box>

          {/* Personal Info Tab */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card elevation={1}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                      Contact Information
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <Person color="action" />
                        </ListItemIcon>
                        {isEditing ? (
                          <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            value={editInfo.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                          />
                        ) : (
                          <ListItemText
                            primary="Full Name"
                            secondary={userInfo.name}
                          />
                        )}
                      </ListItem>
                      <Divider variant="inset" component="li" />
                      <ListItem>
                        <ListItemIcon>
                          <Email color="action" />
                        </ListItemIcon>
                        {isEditing ? (
                          <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            value={editInfo.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                          />
                        ) : (
                          <ListItemText
                            primary="Email"
                            secondary={userInfo.email}
                          />
                        )}
                      </ListItem>
                      <Divider variant="inset" component="li" />
                      <ListItem>
                        <ListItemIcon>
                          <Phone color="action" />
                        </ListItemIcon>
                        {isEditing ? (
                          <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            value={editInfo.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                          />
                        ) : (
                          <ListItemText
                            primary="Phone"
                            secondary={userInfo.phone}
                          />
                        )}
                      </ListItem>
                      <Divider variant="inset" component="li" />
                      <ListItem>
                        <ListItemIcon>
                          <LocationOn color="action" />
                        </ListItemIcon>
                        {isEditing ? (
                          <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            multiline
                            rows={2}
                            value={editInfo.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                          />
                        ) : (
                          <ListItemText
                            primary="Address"
                            secondary={userInfo.address}
                          />
                        )}
                      </ListItem>
                    </List>
                    
                    {isEditing && (
                      <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <Button
                          variant="outlined"
                          startIcon={<Cancel />}
                          onClick={handleCancel}
                          disabled={isUpdating}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="contained"
                          startIcon={<Save />}
                          onClick={handleSave}
                          disabled={isUpdating}
                          sx={{ bgcolor: '#8A9A5B', '&:hover': { bgcolor: '#7A8A4B' } }}
                        >
                          {isUpdating ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </Box>
                    )}
                    
                    {updateMessage && (
                      <Alert 
                        severity={updateMessage.includes('successfully') ? 'success' : 'error'}
                        sx={{ mt: 2 }}
                      >
                        {updateMessage}
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Account Information Section */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Card elevation={1}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                      Account Information
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          {userInfo.provider === 'google' ? <Google color="primary" /> : <Person color="action" />}
                        </ListItemIcon>
                        <ListItemText
                          primary="Sign-up Method"
                          secondary={
                            <>
                              <Typography variant="caption" color="text.secondary">
                                {userInfo.provider === 'google' ? 'Google OAuth' : 'Email & Password'}
                              </Typography>
                              {userInfo.provider === 'google' && (
                                <Typography variant="caption" color="text.secondary">
                                  - Profile picture synced from Google
                                </Typography>
                              )}
                            </>
                          }
                        />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                      {user?.isVerified && (
                        <>
                          <ListItem>
                            <ListItemIcon>
                              <Settings color="success" />
                            </ListItemIcon>
                            <ListItemText primary="Account Status" />
                            <Stack direction="row" spacing={1}>
                              <Chip
                                label="✓ Verified Account"
                                color="success"
                                size="small"
                              />
                            </Stack>
                          </ListItem>
                          <Divider variant="inset" component="li" />
                        </>
                      )}
                      <ListItem>
                        <ListItemIcon>
                          <Person color="action" />
                        </ListItemIcon>
                        <ListItemText primary="Account Type" />
                        <Stack direction="row" spacing={1}>
                          <Chip
                            label={user?.role === 'admin' ? 'Administrator' : 'Customer'}
                            color={user?.role === 'admin' ? 'secondary' : 'primary'}
                            size="small"
                          />
                        </Stack>
                      </ListItem>
                    </List>
                    
                    {userInfo.provider === 'google' && (
                      <Alert severity="info" sx={{ mt: 2 }}>
                        <Typography variant="body2">
                          <strong>Google Account Benefits:</strong>
                          <br />• No password to remember
                          <br />• Profile picture automatically synced
                          <br />• Enhanced security through Google
                        </Typography>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Order History Tab */}
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
              Order History
            </Typography>
            
            {ordersLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <Typography>Loading orders...</Typography>
              </Box>
            ) : orders.length === 0 ? (
              <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No Orders Yet
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  You haven't placed any orders yet. Start shopping to see your order history here.
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={() => navigate('/')}
                  sx={{ bgcolor: '#8A9A5B', '&:hover': { bgcolor: '#7A8A4B' } }}
                >
                  Start Shopping
                </Button>
              </Paper>
            ) : (
              <Grid container spacing={3}>
                {orders.map((order) => (
                  <Grid size={{ xs: 12 }} key={order._id}>
                    <Card elevation={1}>
                      <CardContent>
                        <Grid container alignItems="center" spacing={2}>
                          <Grid size={{ xs: 12, sm: 2 }}>
                            <Typography variant="h6" color="primary">
                              #{order._id?.slice(-8).toUpperCase()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(order.createdAt || '').toLocaleDateString()}
                            </Typography>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 3 }}>
                            <Typography variant="body1">
                              {order.products?.length} item{order.products?.length !== 1 ? 's' : ''}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {order.products?.map(p => p.productId?.name).filter(Boolean).join(', ').slice(0, 50)}
                              {order.products?.map(p => p.productId?.name).filter(Boolean).join(', ').length > 50 ? '...' : ''}
                            </Typography>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 2 }}>
                            <Chip
                              label={order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                              color={getStatusColor(order.status || '')}
                              size="small"
                            />
                            <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
                              {order.paymentMethod?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Typography>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 2 }}>
                            <Typography variant="h6" sx={{ color: '#8A9A5B' }}>
                              ${order.total?.toFixed(2)}
                            </Typography>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 1 }}>
                            <Button 
                              variant="outlined" 
                              size="small"
                              onClick={() => navigate(`/order-confirmation/${order._id}`)}
                            >
                              View
                            </Button>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </TabPanel>

          {/* Settings Tab */}
          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
              Account Settings
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card elevation={1}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Security
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Button variant="outlined" fullWidth sx={{ mb: 2 }}>
                        Change Password
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
        </Paper>
          </>
        )}
      </Container>

      <Footer />
    </>
  );
};

export default Profile;