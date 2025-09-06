import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Button } from '@mui/material';
import { ShoppingCart, FavoriteBorder, Favorite } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useWishlistStore } from '../../store/wishlistStore';
import { useAuthStore } from '../../store/authStore';
import { useTheme } from '@mui/material/styles';
import LoginRequiredAlert from './LoginRequiredAlert';

interface ProductCardProps {
  product: {
    name: string;
    price: number;
    description?: string;
    _id: string;
  };
  onAddToCart: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isInWishlist, addItemToWishlist, removeItemFromWishlist } = useWishlistStore();
  const { isLoggedIn } = useAuthStore();
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  
  const isProductInWishlist = isInWishlist(product._id);

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isLoggedIn) {
      setAlertMessage("Please log in to save items to your wishlist");
      setShowLoginAlert(true);
      return;
    }
    
    try {
      if (isProductInWishlist) {
        await removeItemFromWishlist(product._id);
      } else {
        await addItemToWishlist(product._id);
      }
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isLoggedIn) {
      setAlertMessage("Please log in to add items to your cart");
      setShowLoginAlert(true);
      return;
    }
    
    onAddToCart(product._id);
  };

  return (
    <Card
      sx={{
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: `0 8px 24px ${theme.palette.primary.main}1F`,
          transform: 'translateY(-2px)',
          borderColor: `${theme.palette.secondary.main}4D`,
        }
      }}
      onClick={handleCardClick}
    >
      <Box 
        sx={{ 
          height: 4, 
          bgcolor: 'secondary.main',
          width: '100%'
        }} 
      />
      
      <CardContent 
        sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column',
          p: { xs: 2, sm: 3 },
          '&:last-child': { pb: { xs: 2, sm: 3 } }
        }}
      >
        <Typography 
          variant="h6" 
          sx={{
            fontWeight: 600,
            color: 'text.primary',
            mb: 1.5,
            lineHeight: 1.3,
            fontSize: { xs: '1rem', sm: '1.125rem' }
          }}
        >
          {product.name}
        </Typography>

        {product.description && (
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'text.secondary',
              mb: 2,
              lineHeight: 1.5,
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              flexGrow: 1
            }}
          >
            {product.description.length > 100
              ? `${product.description.substring(0, 100)}...`
              : product.description
            }
          </Typography>
        )}

        <Box sx={{ mt: 'auto' }}>
          <Box 
            sx={{ 
              bgcolor: `${theme.palette.secondary.main}1A`,
              borderRadius: 1,
              p: { xs: 1, sm: 1.5 },
              mb: 2,
              borderLeft: `4px solid ${theme.palette.secondary.main}`
            }}
          >
            <Typography 
              variant="h5" 
              sx={{ 
                color: 'primary.main',
                fontWeight: 700,
                fontSize: { xs: '1.25rem', sm: '1.375rem' }
              }}
            >
              ${product.price.toLocaleString()}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'secondary.main',
                fontSize: { xs: '0.625rem', sm: '0.75rem' },
                fontWeight: 500
              }}
            >
              Free shipping available
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: { xs: 1, sm: 1.5 }, alignItems: 'center' }}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<ShoppingCart fontSize="small" />}
              onClick={handleAddToCart}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                fontWeight: 600,
                py: { xs: 0.75, sm: 1 },
                textTransform: 'none',
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                borderRadius: 1.5,
                '&:hover': {
                  bgcolor: 'primary.dark',
                  boxShadow: `0 4px 12px ${theme.palette.primary.main}4D`,
                },
                '&:active': {
                  transform: 'scale(0.98)'
                }
              }}
            >
              Add to Cart
            </Button>

            <Button
              onClick={handleWishlistToggle}
              sx={{
                minWidth: { xs: 40, sm: 48 },
                height: { xs: 40, sm: 48 },
                borderRadius: 1.5,
                color: isProductInWishlist ? 'secondary.main' : 'text.disabled',
                bgcolor: isProductInWishlist ? `${theme.palette.secondary.main}1A` : 'rgba(0, 0, 0, 0.04)',
                border: `1px solid ${isProductInWishlist ? theme.palette.secondary.main : theme.palette.divider}`,
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: `${theme.palette.secondary.main}26`,
                  color: 'secondary.main',
                  borderColor: 'secondary.main',
                  transform: 'scale(1.05)'
                }
              }}
            >
              {isProductInWishlist ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
            </Button>
          </Box>
        </Box>
      </CardContent>

      {/* Login Required Alert */}
      <LoginRequiredAlert 
        open={showLoginAlert} 
        onClose={() => setShowLoginAlert(false)}
        message={alertMessage}
      />
    </Card>
  );
};

export default ProductCard;