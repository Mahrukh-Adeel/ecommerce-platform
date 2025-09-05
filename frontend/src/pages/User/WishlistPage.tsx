import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { FavoriteOutlined } from '@mui/icons-material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import WishlistCard from '../../components/ui/WishlistCard';
import { useWishlistStore } from '../../store/wishlistStore';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';

const WishlistPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addItemToCart } = useCartStore();
  const {
    items,
    loading,
    error,
    fetchWishlist,
    removeItemFromWishlist,
  } = useWishlistStore();

  useEffect(() => {
    if (user?.id) {
      fetchWishlist(user.id);
    }
  }, [user?.id, fetchWishlist]);

  const handleAddToCart = async (productId: string) => {
    try {
      await addItemToCart(productId, 1);
      // Optionally remove from wishlist after adding to cart
      // await handleRemoveFromWishlist(productId);
    } catch (error) {
      console.error('Failed to add product to cart:', error);
    }
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await removeItemFromWishlist(productId);
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  };

  const handleViewProduct = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Container>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <CircularProgress />
          </Box>
        </Container>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <Container sx={{ py: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container sx={{ py: 4, minHeight: '80vh' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <FavoriteOutlined sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            My Wishlist
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
            ({items.length} items)
          </Typography>
        </Box>

        {items.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <FavoriteOutlined sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Your wishlist is empty
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Browse our products and add items to your wishlist
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/products')}
            >
              Shop Now
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {items.map((item) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={item._id}>
                <WishlistCard
                  item={item}
                  onAddToCart={handleAddToCart}
                  onRemoveFromWishlist={handleRemoveFromWishlist}
                  onViewProduct={handleViewProduct}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default WishlistPage;