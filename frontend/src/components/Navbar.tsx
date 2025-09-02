import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  TextField, 
  IconButton,
  Badge,
  InputAdornment,
  Menu,
  MenuItem
} from '@mui/material';
import { 
  Search as SearchIcon,
  FavoriteBorder as WishlistIcon,
  ShoppingCart as CartIcon,
  AccountCircle,
  Logout
} from '@mui/icons-material';
import { useState, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Navbar() {
  const { user, isLoggedIn, logout } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount] = useState(3);
  const [wishlistCount] = useState(2);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const goToCategories = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate('/categories');
  };

  const goToHome = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate('/');
  };

  const goToProducts = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate('/products');
  };

  const goToLogin = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate('/login');
  };

  const goToSignup = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate('/signup');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleProfileMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ top: 0, zIndex: 1100 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography onClick={() => navigate('/')} variant="h6" sx={{ flexShrink: 0 }}>
            Everwood
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            {isLoggedIn ? (
              <>
                <IconButton 
                  color="inherit"
                  onClick={handleProfileMenuOpen}
                  title={user?.name || 'Profile'}
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleProfileMenuClose}
                >
                  <MenuItem onClick={() => {
                    handleProfileMenuClose();
                    navigate('/profile');
                  }}>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={() => {
                    handleProfileMenuClose();
                    handleLogout();
                  }}>
                    <Logout sx={{ mr: 1 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button onClick={goToLogin} color="inherit" size="small">Login</Button>
                <Button onClick={goToSignup} color="inherit" size="small">Signup</Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <AppBar position="static" 
        sx={{ 
          top: 64,
          zIndex: 1099,
          bgcolor: 'secondary.main'
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 56 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button onClick={goToHome} color="inherit">Home</Button>
            <Button onClick={goToProducts} color="inherit">Products</Button>
            <Button onClick={goToCategories} color="inherit">Categories</Button>
          </Box>
          
          <Box 
            component="form" 
            onSubmit={handleSearch}
            sx={{ 
              flexGrow: 1, 
              maxWidth: 400, 
              mx: 4
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      type="submit" 
                      size="small" 
                      sx={{ color: 'inherit' }}
                    >
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: 1,
                  '& .MuiInputBase-input::placeholder': {
                    color: 'rgba(0, 0, 0, 0.6)',
                    opacity: 1,
                  },
                  '& .MuiInputBase-input': {
                    color: 'black',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'transparent',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.8)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white',
                  },
                }
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton 
              color="inherit" 
              onClick={() => console.log('Open wishlist')}
              title="Wishlist"
            >
              <Badge badgeContent={wishlistCount} color="error">
                <WishlistIcon />
              </Badge>
            </IconButton>

            <IconButton 
              color="inherit" 
              onClick={() => console.log('Open cart')}
              title="Shopping Cart"
            >
              <Badge badgeContent={cartCount} color="error">
                <CartIcon />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}