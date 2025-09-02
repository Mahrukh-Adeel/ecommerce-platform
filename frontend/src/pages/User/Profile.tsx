import React, { useState } from 'react';
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
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  LocationOn,
  ShoppingBag,
  Favorite,
  Settings,
  Save,
  Cancel,
} from '@mui/icons-material';
import NavBar from '../../components/Navbar';
import Footer from '../../components/Footer';

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
  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, New York, NY 10001',
    joinDate: 'Member since March 2023',
  });

  const [editInfo, setEditInfo] = useState({ ...userInfo });

  const recentOrders = [
    {
      id: '#ORD-001',
      date: '2024-08-15',
      status: 'Delivered',
      total: '$1,299.99',
      items: 'Velvet Sofa, Coffee Table',
    },
    {
      id: '#ORD-002',
      date: '2024-08-01',
      status: 'Shipped',
      total: '$549.99',
      items: 'Dining Chair Set (4)',
    },
    {
      id: '#ORD-003',
      date: '2024-07-20',
      status: 'Delivered',
      total: '$899.99',
      items: 'Oak Bookshelf',
    },
  ];

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSave = () => {
    setUserInfo({ ...editInfo });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditInfo({ ...userInfo });
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditInfo({ ...editInfo, [field]: value });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'success';
      case 'Shipped':
        return 'primary';
      case 'Processing':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <>
      <NavBar />
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
        {/* Header Section */}
        <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 12, md: 2 }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: 'primary.main',
                  fontSize: '2rem',
                }}
              >
                {userInfo.name.split(' ').map(n => n[0]).join('')}
              </Avatar>
            </Grid>
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
                {userInfo.name}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {userInfo.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {userInfo.joinDate}
              </Typography>
            </Grid>
            {/* <Grid>
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={handleEdit}
                sx={{ bgcolor: '#8A9A5B', '&:hover': { bgcolor: '#7A8A4B' } }}
              >
                Edit Profile
              </Button>
            </Grid> */}
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
                icon={<Favorite />}
                label="Wishlist"
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
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="contained"
                          startIcon={<Save />}
                          onClick={handleSave}
                          sx={{ bgcolor: '#8A9A5B', '&:hover': { bgcolor: '#7A8A4B' } }}
                        >
                          Save Changes
                        </Button>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Card elevation={1}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                      Account Summary
                    </Typography>
                    <Box sx={{ mt: 3 }}>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h4" color="primary">
                              12
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Total Orders
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h4" color="secondary">
                              5
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Wishlist Items
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ color: '#8A9A5B' }}>
                              $4,299.97
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Total Spent
                            </Typography>
                          </Paper>
                        </Grid>
                      </Grid>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Order History Tab */}
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
              Recent Orders
            </Typography>
            <Grid container spacing={3}>
              {recentOrders.map((order) => (
                <Grid size={{ xs: 12 }} key={order.id}>
                  <Card elevation={1}>
                    <CardContent>
                      <Grid container alignItems="center" spacing={2}>
                        <Grid size={{ xs: 12, sm: 3 }}>
                          <Typography variant="h6" color="primary">
                            {order.id}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(order.date).toLocaleDateString()}
                          </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                          <Typography variant="body1">
                            {order.items}
                          </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 2 }}>
                          <Chip
                            label={order.status}
                            color={getStatusColor(order.status)}
                            size="small"
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 2 }}>
                          <Typography variant="h6" sx={{ color: '#8A9A5B' }}>
                            {order.total}
                          </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 1 }}>
                          <Button variant="outlined" size="small">
                            View
                          </Button>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          {/* Wishlist Tab */}
          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
              Your Wishlist
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Save items you love for later. Your wishlist is empty right now.
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                sx={{ bgcolor: '#8A9A5B', '&:hover': { bgcolor: '#7A8A4B' } }}
              >
                Browse Products
              </Button>
            </Box>
          </TabPanel>

          {/* Settings Tab */}
          <TabPanel value={tabValue} index={3}>
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
      </Container>

      <Footer />
    </>
  );
};

export default Profile;