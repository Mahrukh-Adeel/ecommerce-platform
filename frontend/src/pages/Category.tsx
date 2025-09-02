import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  InputAdornment,
  Paper,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { Search, ShoppingCart, FavoriteBorder } from "@mui/icons-material";
import { getCategoriesWithProducts } from "../data/categoriesData";
import type { CategoriesData } from "../models/CategoriesData";
import { useNavigate } from "react-router-dom";

const Category: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categories, setCategories] = useState<CategoriesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCategoriesWithProducts();
        
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          console.error('Data is not an array:', data);
          setCategories([]);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError("Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
      <Container>
        <Typography align="center" color="error">
          {error}
        </Typography>
      </Container>
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

        {Array.isArray(categories) && categories.length > 0 ? (
          categories.map((category, index) => (
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
                    <Card
                      onClick={() => navigate(`/product/${product._id}`)}
                      sx={{
                        cursor: 'pointer',
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 4,
                        },
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={product.image}
                        alt={product.name}
                      />
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {product.name}
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{ color: "primary.main", mb: 2 }}
                        >
                          ${product.price}
                        </Typography>
                        <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
                          <Button
                            variant="contained"
                            fullWidth
                            startIcon={<ShoppingCart />}
                            onClick={(e) => {
                              e.stopPropagation();
                              // To cart logic 
                            }}
                          >
                            Add to Cart
                          </Button>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              // To wishlist logic 
                            }}
                          >
                            <FavoriteBorder />
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
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