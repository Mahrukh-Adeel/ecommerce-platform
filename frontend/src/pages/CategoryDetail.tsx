import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  CircularProgress,
} from "@mui/material";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { fetchProductsByCategory } from "../api/productApi";
import { fetchCategoryById } from "../api/categoryApi";
import type { ProductData } from "../models/CategoriesData";
import type { Category } from "../models/Category";
import { useNavigate, useParams } from "react-router-dom";
import ProductCard from '../components/ui/ProductCard';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useAuthStore } from '../store/authStore';

const CategoryDetail: React.FC = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();
  
  const [products, setProducts] = useState<ProductData[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuthStore();
  const { addItemToCart } = useCartStore();
  const { addItemToWishlist, isInWishlist } = useWishlistStore();

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
      if (!categoryId) {
        setError("Category ID is required");
        setLoading(false);
        return;
      }

      try {
        const [categoryData, productsData] = await Promise.all([
          fetchCategoryById(categoryId),
          fetchProductsByCategory(categoryId)
        ]);
        
        setCategory(categoryData);
        setProducts(Array.isArray(productsData) ? productsData : []);
      } catch (err) {
        console.error('Error fetching category data:', err);
        setError("Failed to fetch category data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

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
            <Typography variant="h4" color="error" gutterBottom>
              {error}
            </Typography>
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
                  onAddToWishlist={handleAddToWishlist} 
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