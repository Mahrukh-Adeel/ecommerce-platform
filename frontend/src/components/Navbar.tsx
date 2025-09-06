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
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  Divider
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { 
  Search as SearchIcon,
  Clear as ClearIcon,
  FavoriteBorder as WishlistOutlinedIcon,
  Favorite as WishlistFilledIcon,
  ShoppingCartOutlined as CartOutlinedIcon,
  ShoppingCart as CartFilledIcon,
  AccountCircle,
  Logout,
  Menu as MenuIcon
} from '@mui/icons-material';
import { useState, useEffect, type MouseEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useUIStore } from '../store/uiStore';

export default function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, isLoggedIn, logout } = useAuthStore();
  const { getCart, cart } = useCartStore();
  const { getWishlistCount, fetchWishlist } = useWishlistStore();
  const { searchQuery, setSearchQuery, anchorEl, setAnchorEl } = useUIStore();
  const [hasInitializedCart, setHasInitializedCart] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
      
      // Clear cart and wishlist stores after logout
      const { clearCartState } = useCartStore.getState();
      const { clearWishlist } = useWishlistStore.getState();
      
      clearCartState();
      clearWishlist();
      
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

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMobileNavigation = (navigationFn: () => void) => {
    navigationFn();
    setMobileOpen(false);
  };

  const mobileDrawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2, color: 'primary.main', fontWeight: 600 }}>
        Everwood
      </Typography>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleMobileNavigation(() => navigate('/'))}>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleMobileNavigation(() => navigate('/products'))}>
            <ListItemText primary="Products" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleMobileNavigation(() => navigate('/categories'))}>
            <ListItemText primary="Categories" />
          </ListItemButton>
        </ListItem>
        {!isLoggedIn && (
          <>
            <Divider />
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleMobileNavigation(() => navigate('/login'))}>
                <ListItemText primary="Login" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleMobileNavigation(() => navigate('/signup'))}>
                <ListItemText primary="Sign Up" />
              </ListItemButton>
            </ListItem>
          </>
        )}
        {isLoggedIn && (
          <>
            <Divider />
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleMobileNavigation(() => navigate('/profile'))}>
                <ListItemText primary="Profile" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleMobileNavigation(() => navigate('/admin/dashboard'))}>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleMobileNavigation(handleLogout)}>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar 
        position="static" 
        elevation={1}
        sx={{ 
          top: 0, 
          zIndex: 1100,
          bgcolor: 'primary.main', 
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <Toolbar sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          minHeight: { xs: 56, sm: 64 },
          px: { xs: 1, sm: 2, md: 3 }
        }}>
          {/* Mobile Menu Icon */}
          {isMobile && (
            <IconButton
              color="inherit"
              onClick={handleDrawerToggle}
              edge="start"
              sx={{
                mr: 1,
                color: 'background.default',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography 
            onClick={() => navigate('/')} 
            variant="h5" 
            sx={{ 
              flexShrink: 0,
              cursor: 'pointer',
              fontWeight: 600,
              letterSpacing: 0.5,
              color: 'background.default',
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
              '&:hover': {
                opacity: 0.9
              }
            }}
          >
            Everwood
          </Typography>
          
          {/* Desktop Auth Buttons */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {isLoggedIn ? (
                <>
                  <IconButton 
                    color="inherit"
                    onClick={handleProfileMenuOpen}
                    title={user?.name || 'Profile'}
                    sx={{
                      color: 'background.default',
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
                        bgcolor: 'background.paper',
                        border: `1px solid ${theme.palette.divider}`,
                        '& .MuiMenuItem-root': {
                          color: 'text.primary'
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
                      color: 'background.default',
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
                      color: 'background.default',
                      borderColor: 'background.default',
                      textTransform: 'none',
                      fontSize: '14px',
                      fontWeight: 500,
                      px: 2,
                      py: 0.5,
                      '&:hover': {
                        bgcolor: `${theme.palette.background.default}1A`,
                        borderColor: 'background.default'
                      }
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </Box>
          )}

          {/* Mobile Actions */}
          {isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {isLoggedIn && (
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
                        bgcolor: 'secondary.main',
                        color: 'white',
                        fontSize: '10px',
                        fontWeight: 600
                      }
                    }}
                  >
                    {isOnWishlistPage ? (
                      <WishlistFilledIcon fontSize="small" />
                    ) : (
                      <WishlistOutlinedIcon fontSize="small" />
                    )}
                  </Badge>
                </IconButton>
              )}

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
                      bgcolor: 'secondary.main',
                      color: 'white',
                      fontSize: '10px',
                      fontWeight: 600
                    }
                  }}
                >
                  {isOnCartPage ? (
                    <CartFilledIcon fontSize="small" />
                  ) : (
                    <CartOutlinedIcon fontSize="small" />
                  )}
                </Badge>
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Second Navigation Bar (Desktop/Tablet) */}
      {!isMobile && (
        <AppBar 
          position="static" 
          elevation={0}
          sx={{ 
            top: 64,
            zIndex: 1099,
            bgcolor: 'secondary.main', 
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
                            color: 'text.primary',
                            mr: 0.5,
                            '&:hover': {
                              bgcolor: `${theme.palette.text.primary}1A`
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
                          color: 'text.primary',
                          '&:hover': {
                            bgcolor: `${theme.palette.text.primary}1A`
                          }
                        }}
                      >
                        <SearchIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    backgroundColor: 'background.default',
                    borderRadius: 2,
                    fontSize: '14px',
                    '& .MuiInputBase-input': {
                      color: 'text.primary',
                      py: 1,
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: `${theme.palette.text.primary}99`,
                      opacity: 1,
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'transparent',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: `${theme.palette.primary.main}4D`,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                      borderWidth: '2px'
                    },
                  }
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {isLoggedIn && (
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
                        bgcolor: 'primary.main',
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
              )}

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
                      bgcolor: 'primary.main',
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
      )}

      {/* Mobile Search Bar */}
      {isMobile && (
        <Box sx={{ bgcolor: 'background.paper', p: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box 
            component="form" 
            onSubmit={handleSearch}
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
                          color: 'text.primary',
                          mr: 0.5,
                          '&:hover': {
                            bgcolor: `${theme.palette.text.primary}1A`
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
                        color: 'text.primary',
                        '&:hover': {
                          bgcolor: `${theme.palette.text.primary}1A`
                        }
                      }}
                    >
                      <SearchIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>
      )}

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 240,
            bgcolor: 'background.paper'
          },
        }}
      >
        {mobileDrawer}
      </Drawer>
    </Box>
  );
}