import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
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
  type SelectChangeEvent,
} from "@mui/material";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { Search, ShoppingCart, FavoriteBorder } from "@mui/icons-material";
import { fetchProducts } from "../api/productApi";
import type { ProductData } from "../models/CategoriesData";
import { useNavigate } from "react-router-dom";

const Products: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("name");
  const [allProducts, setAllProducts] = useState<ProductData[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const products = await fetchProducts();
        console.log('Fetched products:', products); 
        
        if (Array.isArray(products)) {
          setAllProducts(products);
          setFilteredProducts(products);
        } else {
          console.error('Products data is not an array:', products);
          setAllProducts([]);
          setFilteredProducts([]);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = allProducts;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        default:
          return 0;
      }
    });

    setFilteredProducts(sorted);
  }, [allProducts, searchTerm, sortBy]);

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
          <Typography align="center" color="error">
            {error}
          </Typography>
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
                <Card
                  onClick={() => navigate(`/product/${product._id}`)}
                  sx={{
                    cursor: 'pointer',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.image}
                    alt={product.name}
                  />
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" gutterBottom>
                      {product.name}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ color: "primary.main", mb: 2, fontWeight: 'bold' }}
                    >
                      ${product.price}
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "row", gap: 1, mt: 'auto' }}>
                      <Button
                        variant="contained"
                        fullWidth
                        startIcon={<ShoppingCart />}
                        onClick={(e) => {
                          e.stopPropagation(); 
                          // Add to cart logic here
                        }}
                      >
                        Add to Cart
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation(); 
                          // Add to wishlist logic here
                        }}
                        sx={{ minWidth: 'auto' }}
                      >
                        <FavoriteBorder />
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
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