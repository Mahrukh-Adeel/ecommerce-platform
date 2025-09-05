import React from 'react';
import { Card, CardContent, Typography, Box, Button } from '@mui/material';
import { ShoppingCart, FavoriteBorder, Favorite } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useWishlistStore } from '../../store/wishlistStore';
import { useTheme } from '@mui/material/styles';

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
  const isProductInWishlist = isInWishlist(product._id);

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
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
          p: 3,
          '&:last-child': { pb: 3 }
        }}
      >
        <Typography 
          variant="h6" 
          sx={{
            fontWeight: 600,
            color: 'text.primary',
            mb: 1.5,
            lineHeight: 1.3,
            fontSize: '18px'
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
              fontSize: '14px',
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
              p: 1.5,
              mb: 2,
              borderLeft: `4px solid ${theme.palette.secondary.main}`
            }}
          >
            <Typography 
              variant="h5" 
              sx={{ 
                color: 'primary.main',
                fontWeight: 700,
                fontSize: '22px'
              }}
            >
              ${product.price.toLocaleString()}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'secondary.main',
                fontSize: '12px',
                fontWeight: 500
              }}
            >
              Free shipping available
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<ShoppingCart fontSize="small" />}
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product._id);
              }}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                fontWeight: 600,
                py: 1,
                textTransform: 'none',
                fontSize: '14px',
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
                minWidth: 48,
                height: 48,
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
    </Card>
  );
};

export default ProductCard;