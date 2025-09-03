import React from 'react';
import { Card, CardContent, Typography, Box, Button } from '@mui/material';
import { ShoppingCart, FavoriteBorder } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: {
    name: string;
    price: number;
    description?: string;
    _id: string;
  };
  onAddToCart: (productId: string) => void;
  onAddToWishlist: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onAddToWishlist }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <Card 
      sx={{ 
        cursor: 'pointer', 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        '&:hover': {
          boxShadow: 4,
        }
      }}
      onClick={handleCardClick}
    >
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" gutterBottom>
          {product.name}
        </Typography>
        {product.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {product.description.length > 100 
              ? `${product.description.substring(0, 100)}...` 
              : product.description
            }
          </Typography>
        )}
        <Box sx={{ mt: 'auto' }}>
          <Typography variant="h6" sx={{ color: 'primary.main', mb: 2, fontWeight: 'bold' }}>
            ${product.price}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<ShoppingCart />}
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product._id);
              }}
            >
              Add to Cart
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onAddToWishlist(product._id);
              }}
              sx={{ minWidth: 'auto' }}
            >
              <FavoriteBorder />
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;