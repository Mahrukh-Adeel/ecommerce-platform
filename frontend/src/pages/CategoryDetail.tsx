import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductCard from '../components/ui/ProductCard';
import { useCartStore } from '../store/cartStore';
import { useCategoriesStore } from '../store/categoriesStore';
import { useProductsStore } from '../store/productsStore';

const CategoryDetail: React.FC = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();
  
  const { 
    currentCategory: category, 
    loading: categoryLoading, 
    error: categoryError, 
    fetchSingleCategory 
  } = useCategoriesStore();
  
  const { 
    loading: productsLoading, 
    fetchProductsByCategory 
  } = useProductsStore();
  
  const { addItemToCart } = useCartStore();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [products, setProducts] = useState<any[]>([]);
  
  console.log('CategoryDetail Debug:', {
    categoryId,
    productsCount: products.length,
    sampleProduct: products[0],
    category: category?.name
  });
  
  const loading = categoryLoading || productsLoading;
  const error = categoryError;

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
      if (!categoryId) return;
      
      try {
        const [, productsData] = await Promise.all([
          fetchSingleCategory(categoryId),
          fetchProductsByCategory(categoryId)
        ]);
        
        setProducts(productsData);
      } catch (err) {
        console.error('Error fetching category data:', err);
      }
    };
    
    fetchData();
  }, [categoryId, fetchSingleCategory, fetchProductsByCategory]);

  if (loading) {
    return (
      <>
        <NavBar />
        <Container>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
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
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Alert severity="error" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
              {error}
            </Alert>
            <Button variant="contained" onClick={() => navigate('/')}>
              Go Back Home
            </Button>
          </Box>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <NavBar />
      <Container sx={{ py: 4 }}>
        {/* Category Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h2"
            gutterBottom
            sx={{
              color: "text.primary",
              textDecoration: "underline",
              textDecorationColor: (theme) => theme.palette.secondary.main,
              fontWeight: "bold",
            }}
          >
            {category?.name}
          </Typography>
          {category?.description && (
            <Typography
              variant="h6"
              sx={{ color: "text.secondary", mb: 2 }}
            >
              {category.description}
            </Typography>
          )}
          <Typography variant="body1" color="text.secondary">
            {products.length} products
          </Typography>
        </Box>

        {/* Products Grid */}
        {products.length > 0 ? (
          <Grid container spacing={3}>
            {products.map((product) => (
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
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No products in this category
            </Typography>
          </Box>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default CategoryDetail;