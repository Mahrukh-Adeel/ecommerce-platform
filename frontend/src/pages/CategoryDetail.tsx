import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
  CircularProgress,
} from "@mui/material";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { ShoppingCart, FavoriteBorder } from "@mui/icons-material";
import { fetchProductsByCategory } from "../api/productApi";
import { fetchCategoryById } from "../api/categoryApi";
import type { ProductData } from "../models/CategoriesData";
import type { Category } from "../models/Category";
import { useNavigate, useParams } from "react-router-dom";

const CategoryDetail: React.FC = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();
  
  const [products, setProducts] = useState<ProductData[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
                <Card
                  onClick={() => navigate(`/product/${product._id}`)}
                  sx={{
                    cursor: 'pointer',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="250"
                    image={product.image}
                    alt={product.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" gutterBottom>
                      {product.name}
                    </Typography>
                    {product.description && (
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ mb: 2, flexGrow: 1 }}
                      >
                        {product.description.length > 100 
                          ? `${product.description.substring(0, 100)}...` 
                          : product.description
                        }
                      </Typography>
                    )}
                    <Box sx={{ mt: 'auto' }}>
                      <Typography
                        variant="h5"
                        sx={{ color: "primary.main", mb: 2, fontWeight: 'bold' }}
                      >
                        ${product.price}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          variant="contained"
                          fullWidth
                          startIcon={<ShoppingCart />}
                          onClick={(e) => {
                            e.stopPropagation();
                            // Add to cart logic here
                            console.log('Add to cart:', product._id);
                          }}
                        >
                          Add to Cart
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Add to wishlist logic here
                            console.log('Add to wishlist:', product._id);
                          }}
                        >
                          <FavoriteBorder />
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
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