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
  Chip,
  Stack,
} from "@mui/material";
import {
  Person,
  AdminPanelSettings,
  Edit,
} from "@mui/icons-material";
import AdminAppBar from "./components/AdminAppBar";
import AdminSidebar from "./components/AdminSidebar";
import { useAuthStore } from "../../store/authStore";
import api from "../../api/axios";

const drawerWidth = 240;

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: string;
  provider?: string;
}

const ManageUsers: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState<'user' | 'admin'>('user');
  const [isUpdating, setIsUpdating] = useState(false);

  const { user: currentUser } = useAuthStore();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get('/users');
      
      if (response.data.success) {
        setUsers(response.data.data);
      } else {
        setError('Failed to fetch users');
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleEditRole = (user: User) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setRoleDialogOpen(true);
  };

  const handleUpdateRole = async () => {
    if (!selectedUser) return;

    setIsUpdating(true);
    try {
      const response = await api.put(`/users/${selectedUser._id}/role`, {
        role: newRole
      });

      if (response.data.success) {
        // Update the user in the local state
        setUsers(users.map(user => 
          user._id === selectedUser._id 
            ? { ...user, role: newRole }
            : user
        ));
        setRoleDialogOpen(false);
        setSelectedUser(null);
      } else {
        setError('Failed to update user role');
      }
    } catch (err) {
      console.error('Failed to update role:', err);
      setError('Failed to update user role');
    } finally {
      setIsUpdating(false);
    }
  };

  const getRoleIcon = (role: string) => {
    return role === 'admin' ? <AdminPanelSettings /> : <Person />;
  };

  const getRoleColor = (role: string) => {
    return role === 'admin' ? 'primary' : 'default';
  };

  if (isLoading) {
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
              Manage Users
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              View and manage user accounts and roles
            </Typography>

            {error && (
              <Alert 
                severity="error" 
                sx={{ mb: 3 }}
                onClose={() => setError(null)}
              >
                {error}
              </Alert>
            )}

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Provider</TableCell>
                    <TableCell>Joined</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <Typography variant="body1" fontWeight="medium">
                          {user.name}
                        </Typography>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip
                          icon={getRoleIcon(user.role)}
                          label={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          color={getRoleColor(user.role)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.isActive ? 'Active' : 'Inactive'}
                          color={user.isActive ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.provider || 'local'}
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Button
                            size="small"
                            startIcon={<Edit />}
                            onClick={() => handleEditRole(user)}
                            disabled={user._id === currentUser?.id} // Prevent editing own role
                          >
                            Edit Role
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {users.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary">
                  No users found
                </Typography>
              </Box>
            )}
          </Paper>
        </Container>

        {/* Role Update Dialog */}
        <Dialog open={roleDialogOpen} onClose={() => setRoleDialogOpen(false)}>
          <DialogTitle>Update User Role</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" gutterBottom>
                Change role for: <strong>{selectedUser?.name}</strong>
              </Typography>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Role</InputLabel>
                <Select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as 'user' | 'admin')}
                  label="Role"
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRoleDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleUpdateRole} 
              variant="contained"
              disabled={isUpdating}
            >
              {isUpdating ? 'Updating...' : 'Update Role'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default ManageUsers;
