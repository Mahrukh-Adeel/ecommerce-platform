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
  Clear as ClearIcon,
  FavoriteBorder as WishlistOutlinedIcon,
  Favorite as WishlistFilledIcon,
  ShoppingCartOutlined as CartOutlinedIcon,
  ShoppingCart as CartFilledIcon,
  AccountCircle,
  Logout
} from '@mui/icons-material';
import { useState, useEffect, type MouseEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useUIStore } from '../store/uiStore';

export default function Navbar() {
  const { user, isLoggedIn, logout } = useAuthStore();
  const { getCart, cart } = useCartStore();
  const { getWishlistCount, fetchWishlist } = useWishlistStore();
  const { searchQuery, setSearchQuery, anchorEl, setAnchorEl } = useUIStore();
  const [hasInitializedCart, setHasInitializedCart] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const isOnWishlistPage = location.pathname === '/wishlist';
  const isOnCartPage = location.pathname === '/cart';

  useEffect(() => {
    if (isLoggedIn && user?.id && !hasInitializedCart) {
      getCart();
      fetchWishlist(user.id).catch(console.error);
      setHasInitializedCart(true);
    } else if (!isLoggedIn) {
      setHasInitializedCart(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, user?.id, hasInitializedCart]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
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
      <AppBar 
        position="static" 
        elevation={1}
        sx={{ 
          top: 0, 
          zIndex: 1100,
          bgcolor: '#4E2A1E', 
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <Toolbar sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          minHeight: 64,
          px: { xs: 2, md: 3 }
        }}>
          <Typography 
            onClick={() => navigate('/')} 
            variant="h5" 
            sx={{ 
              flexShrink: 0,
              cursor: 'pointer',
              fontWeight: 600,
              letterSpacing: 0.5,
              color: '#FEEFE5',
              '&:hover': {
                opacity: 0.9
              }
            }}
          >
            Everwood
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isLoggedIn ? (
              <>
                <IconButton 
                  color="inherit"
                  onClick={handleProfileMenuOpen}
                  title={user?.name || 'Profile'}
                  sx={{
                    color: '#FEEFE5',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleProfileMenuClose}
                  PaperProps={{
                    sx: {
                      bgcolor: '#FFFFFF',
                      border: '1px solid #e0e0e0',
                      '& .MuiMenuItem-root': {
                        color: '#4c525c'
                      }
                    }
                  }}
                >
                  <MenuItem onClick={() => {
                    handleProfileMenuClose();
                    navigate('/profile');
                  }}>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={() => {
                    handleProfileMenuClose();
                    navigate('/admin/dashboard');
                  }}>
                    Dashboard
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
                <Button 
                  onClick={goToLogin} 
                  sx={{
                    color: '#FEEFE5',
                    textTransform: 'none',
                    fontSize: '14px',
                    fontWeight: 500,
                    px: 2,
                    py: 0.5,
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  Login
                </Button>
                <Button 
                  onClick={goToSignup}
                  variant="outlined"
                  sx={{
                    color: '#FEEFE5',
                    borderColor: '#FEEFE5',
                    textTransform: 'none',
                    fontSize: '14px',
                    fontWeight: 500,
                    px: 2,
                    py: 0.5,
                    '&:hover': {
                      bgcolor: 'rgba(254, 239, 229, 0.1)',
                      borderColor: '#FEEFE5'
                    }
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          top: 64,
          zIndex: 1099,
          bgcolor: '#8A9A5B', 
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        <Toolbar sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          minHeight: 56,
          px: { xs: 2, md: 3 }
        }}>
          <Box sx={{ display: 'flex', gap: 0 }}>
            <Button 
              onClick={goToHome} 
              sx={{
                color: 'white',
                textTransform: 'none',
                fontSize: '15px',
                fontWeight: 500,
                px: 2,
                py: 1,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: 1
                }
              }}
            >
              Home
            </Button>
            <Button 
              onClick={goToProducts} 
              sx={{
                color: 'white',
                textTransform: 'none',
                fontSize: '15px',
                fontWeight: 500,
                px: 2,
                py: 1,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: 1
                }
              }}
            >
              Products
            </Button>
            <Button 
              onClick={goToCategories} 
              sx={{
                color: 'white',
                textTransform: 'none',
                fontSize: '15px',
                fontWeight: 500,
                px: 2,
                py: 1,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: 1
                }
              }}
            >
              Categories
            </Button>
          </Box>
          
          {/* Search Bar */}
          <Box 
            component="form" 
            onSubmit={handleSearch}
            sx={{ 
              flexGrow: 1, 
              maxWidth: 450, 
              mx: 4
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Search furniture..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {searchQuery && (
                      <IconButton 
                        onClick={handleClearSearch}
                        size="small" 
                        sx={{ 
                          color: '#4c525c',
                          mr: 0.5,
                          '&:hover': {
                            bgcolor: 'rgba(76, 82, 92, 0.1)'
                          }
                        }}
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    )}
                    <IconButton 
                      type="submit" 
                      size="small" 
                      sx={{ 
                        color: '#4c525c',
                        '&:hover': {
                          bgcolor: 'rgba(76, 82, 92, 0.1)'
                        }
                      }}
                    >
                      <SearchIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  backgroundColor: '#FEEFE5',
                  borderRadius: 2,
                  fontSize: '14px',
                  '& .MuiInputBase-input': {
                    color: '#4c525c',
                    py: 1,
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: 'rgba(76, 82, 92, 0.6)',
                    opacity: 1,
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'transparent',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(78, 42, 30, 0.3)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#4E2A1E',
                    borderWidth: '2px'
                  },
                }
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton 
              color="inherit" 
              onClick={() => navigate('/wishlist')}
              title="Wishlist"
              sx={{
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.15)'
                }
              }}
            >
              <Badge 
                badgeContent={getWishlistCount()} 
                sx={{
                  '& .MuiBadge-badge': {
                    bgcolor: '#4E2A1E',
                    color: 'white',
                    fontSize: '11px',
                    fontWeight: 600
                  }
                }}
              >
                {isOnWishlistPage ? (
                  <WishlistFilledIcon />
                ) : (
                  <WishlistOutlinedIcon />
                )}
              </Badge>
            </IconButton>

            <IconButton 
              color="inherit" 
              onClick={() => navigate('/cart')}
              title="Shopping Cart"
              sx={{
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.15)'
                }
              }}
            >
              <Badge 
                badgeContent={cart?.itemCount || 0}
                sx={{
                  '& .MuiBadge-badge': {
                    bgcolor: '#4E2A1E',
                    color: 'white',
                    fontSize: '11px',
                    fontWeight: 600
                  }
                }}
              >
                {isOnCartPage ? (
                  <CartFilledIcon />
                ) : (
                  <CartOutlinedIcon />
                )}
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}