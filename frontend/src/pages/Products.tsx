import {
  Box,
  Container,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  type SelectChangeEvent,
} from "@mui/material";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "@mui/icons-material";
import ProductCard from '../components/ui/ProductCard';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useAuthStore } from '../store/authStore';
import { useProductsStore } from '../store/productsStore';

const Products: React.FC = () => {
  const [searchParams] = useSearchParams();
  
  const { user } = useAuthStore();
  const { addItemToCart } = useCartStore();
  const { addItemToWishlist, isInWishlist } = useWishlistStore();
  
  const { 
    allProducts, 
    filteredProducts,
    loading, 
    error,
    searchTerm,
    sortBy,
    fetchAllProducts,
    setSearchTerm,
    setSortBy,
    filterAndSortProducts
  } = useProductsStore();

  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch) {
      setSearchTerm(urlSearch);
    }
  }, [searchParams, setSearchTerm]);

  const handleAddToCart = async (productId: string) => {
    try {
      await addItemToCart(productId, 1);
      console.log('Product added to cart:', productId);
    } catch (error) {
      console.error('Failed to add product to cart:', error);
    }
  };

  const handleAddToWishlist = async (productId: string) => {
    if (!user?.id) {
      console.error('User not logged in');
      return;
    }

    try {
      if (isInWishlist(productId)) {
        console.log('Product already in wishlist');
        return;
      }
      
      await addItemToWishlist(productId);
      console.log('Product added to wishlist:', productId);
    } catch (error) {
      console.error('Failed to add product to wishlist:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchAllProducts();
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };
    
    if (allProducts.length === 0) {
      fetchData();
    }
  }, [fetchAllProducts, allProducts.length]);

  useEffect(() => {
    filterAndSortProducts();
  }, [searchTerm, sortBy, allProducts, filterAndSortProducts]);

  const handleSortChange = (e: SelectChangeEvent<string>) => {
    setSortBy(e.target.value);
  };

  if (loading) {
    return (
      <>
        <NavBar />
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
        <NavBar />
        <Container>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Alert severity="error" sx={{ maxWidth: 600 }}>
              {error}
            </Alert>
          </Box>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <NavBar />
      <Container
        sx={{
          minWidth: "100vw",
          m: 0,
          p: 2,
          minHeight: "80vh",
        }}
      >
        <Typography
          variant="h2"
          align="center"
          gutterBottom
          sx={{
            m: 4,
            mb: 4,
            color: "text.primary",
            textDecoration: "underline",
            textDecorationColor: (theme) => theme.palette.secondary.main,
            fontWeight: "bold",
          }}
        >
          Products
        </Typography>
        <Typography
          variant="body1"
          align="center"
          sx={{ mt: 2, mb: 4, color: "text.secondary" }}
        >
          Explore our wide range of furniture products designed to enhance your
          living space.
        </Typography>

        {/* Search and Sort */}
        <Paper sx={{ p: 2, mb: 4 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 8 }}>
              <TextField
                fullWidth
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Sort By</InputLabel>
                <Select value={sortBy} label="Sort By" onChange={handleSortChange}>
                  <MenuItem value="name">Name (A-Z)</MenuItem>
                  <MenuItem value="price-low">Price: Low to High</MenuItem>
                  <MenuItem value="price-high">Price: High to Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Showing {filteredProducts.length} of {allProducts.length} products
        </Typography>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <Grid container spacing={3}>
            {filteredProducts.map((product) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product._id}>
                <ProductCard 
                  product={product} 
                  onAddToCart={handleAddToCart} 
                  onAddToWishlist={handleAddToWishlist} 
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {searchTerm ? 'No products found' : 'No products available'}
            </Typography>
            {searchTerm && (
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search terms
              </Typography>
            )}
          </Box>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default Products;