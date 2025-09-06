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
import { useProductsStore } from '../store/productsStore';

const Products: React.FC = () => {
  const [searchParams] = useSearchParams();
  
  const { addItemToCart } = useCartStore();
  
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
        maxWidth={false}
        sx={{
          px: { xs: 1, sm: 2, md: 3 },
          py: 2,
          minHeight: "80vh",
        }}
      >
        <Typography
          variant="h2"
          align="center"
          gutterBottom
          sx={{
            m: { xs: 2, sm: 3, md: 4 },
            mb: 4,
            color: "text.primary",
            textDecoration: "underline",
            textDecorationColor: (theme) => theme.palette.secondary.main,
            fontWeight: "bold",
            fontSize: { xs: '1.75rem', sm: '2.125rem', md: '2.5rem' },
            px: { xs: 1, sm: 2 }
          }}
        >
          Products
        </Typography>
        <Typography
          variant="body1"
          align="center"
          sx={{ 
            mt: 2, 
            mb: 4, 
            color: "text.secondary",
            fontSize: { xs: '0.875rem', sm: '1rem' },
            px: { xs: 2, sm: 3 }
          }}
        >
          Explore our wide range of furniture products designed to enhance your
          living space.
        </Typography>

        {/* Search and Sort */}
        <Paper sx={{ p: { xs: 1.5, sm: 2 }, mb: 4, mx: { xs: 0, sm: 'auto' }, maxWidth: '1200px' }}>
          <Grid container spacing={{ xs: 1, sm: 2 }}>
            <Grid size={{ xs: 12, md: 8 }}>
              <TextField
                fullWidth
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size={window.innerWidth < 600 ? "small" : "medium"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiInputBase-input': {
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth variant="outlined" size={window.innerWidth < 600 ? "small" : "medium"}>
                <InputLabel>Sort By</InputLabel>
                <Select 
                  value={sortBy} 
                  label="Sort By" 
                  onChange={handleSortChange}
                  sx={{
                    '& .MuiSelect-select': {
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }
                  }}
                >
                  <MenuItem value="name">Name (A-Z)</MenuItem>
                  <MenuItem value="price-low">Price: Low to High</MenuItem>
                  <MenuItem value="price-high">Price: High to Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 2,
              px: { xs: 1, sm: 0 },
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            }}
          >
            Showing {filteredProducts.length} of {allProducts.length} products
          </Typography>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              {filteredProducts.map((product) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product._id}>
                  <ProductCard 
                    product={product} 
                    onAddToCart={handleAddToCart} 
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography 
                variant="h6" 
                color="text.secondary" 
                gutterBottom
                sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
              >
                {searchTerm ? 'No products found' : 'No products available'}
              </Typography>
              {searchTerm && (
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                >
                  Try adjusting your search terms
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default Products;