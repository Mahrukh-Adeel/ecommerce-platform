import {
  Box,
  Container,
  Grid,
  InputAdornment,
  Paper,
  TextField,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect } from "react";
import { Search } from "@mui/icons-material";
import ProductCard from '../components/ui/ProductCard';
import { useCartStore } from '../store/cartStore';
import { useCategoriesStore } from '../store/categoriesStore';

const Category: React.FC = () => {
  const { 
    categoriesWithProducts, 
    loading, 
    error,
    searchTerm,
    setSearchTerm,
    fetchCategoriesWithProducts 
  } = useCategoriesStore();
  
  const { addItemToCart } = useCartStore();

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
        await fetchCategoriesWithProducts();
      } catch (err) {
        console.error('Error fetching categories with products:', err);
      }
    };
    
    if (categoriesWithProducts.length === 0) {
      fetchData();
    }
  }, [fetchCategoriesWithProducts, categoriesWithProducts.length]);

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <CircularProgress />
        </Box>
      </Container>
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
          p: 0,
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
          Categories
        </Typography>
        <Typography
          variant="body1"
          align="center"
          sx={{ mt: 2, mb: 4, color: "text.secondary" }}
        >
          Explore our wide range of furniture products designed to enhance your
          living space.
        </Typography>

        <Paper sx={{ p: 2, mb: 4 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
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
          </Grid>
        </Paper>

        {Array.isArray(categoriesWithProducts) && categoriesWithProducts.length > 0 ? (
          categoriesWithProducts.map((category, index) => (
            <Box key={category._id || index} sx={{ mb: 6 }}>
              {/* Category Header */}
              <Paper sx={{ p: 3, mb: 3, bgcolor: "primary.main", color: "white" }}>
                <Typography variant="h4" component="h2">
                  {category.name}
                </Typography>
                <Typography variant="body1">
                  {category.products?.length || 0} Products
                </Typography>
              </Paper>

              {/* Products Grid */}
              <Grid container spacing={3}>
                {Array.isArray(category.products) && category.products.map((product) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product._id}>
                    <ProductCard 
                      product={product} 
                      onAddToCart={handleAddToCart} 
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))
        ) : (
          <Typography align="center" variant="h6" color="text.secondary">
            No products available
          </Typography>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default Category;