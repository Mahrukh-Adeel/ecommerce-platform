import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Typography,
} from '@mui/material';
import { ShoppingCart, Delete } from '@mui/icons-material';
import type { WishlistItem } from '../../types/wishlist';

interface WishlistCardProps {
  item: WishlistItem;
  onAddToCart: (productId: string) => void;
  onRemoveFromWishlist: (productId: string) => void;
  onViewProduct: (productId: string) => void;
}

const WishlistCard: React.FC<WishlistCardProps> = ({
  item,
  onAddToCart,
  onRemoveFromWishlist,
  onViewProduct,
}) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={item.productId.image || '/placeholder.jpg'}
        alt={item.productId.name}
        sx={{ cursor: 'pointer' }}
        onClick={() => onViewProduct(item.productId._id)}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          variant="h6"
          component="h2"
          gutterBottom
          sx={{
            cursor: 'pointer',
            '&:hover': { color: 'primary.main' }
          }}
          onClick={() => onViewProduct(item.productId._id)}
        >
          {item.productId.name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {item.productId.description}
        </Typography>
        <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
          ${item.productId.price.toFixed(2)}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
        <Button
          variant="contained"
          startIcon={<ShoppingCart />}
          onClick={() => onAddToCart(item.productId._id)}
          size="small"
        >
          Add to Cart
        </Button>
        <IconButton
          color="error"
          onClick={() => onRemoveFromWishlist(item.productId._id)}
          title="Remove from wishlist"
        >
          <Delete />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default WishlistCard;
