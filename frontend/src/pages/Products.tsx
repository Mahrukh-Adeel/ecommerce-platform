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
  type SelectChangeEvent,
} from "@mui/material";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState } from "react";
import { Search, ShoppingCart, FavoriteBorder } from "@mui/icons-material";
import categoriesData from "../data/categoriesData";
import type { CategoriesData } from "../models/CategoriesData";
import { useNavigate } from "react-router-dom";

const Products: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("name");

  const handleSortChange = (e: SelectChangeEvent<string>) => {
    setSortBy(e.target.value);
  };

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

        <Paper sx={{ p: 2, mb: 4 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
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
            <Grid size={{ xs: 12, md: 4 }}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <FormControl fullWidth variant="outlined">
                <InputLabel>Sort By</InputLabel>
                <Select value={sortBy} label="Sort By" onChange={handleSortChange}>
                  <MenuItem value="name">Name</MenuItem>
                  <MenuItem value="price-low">Price: Low to High</MenuItem>
                  <MenuItem value="price-high">Price: High to Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {(categoriesData as CategoriesData[]).map((category, index) => (
          <Box key={index} sx={{ mb: 6 }}>
            {/* Category Header */}
            <Paper sx={{ p: 3, mb: 3, bgcolor: "primary.main", color: "white" }}>
              <Typography variant="h4" component="h2">
                {category.name}
              </Typography>
              <Typography variant="body1">{category.count}</Typography>
            </Paper>

            {/* Products Grid */}
            <Grid container spacing={3}>
              {category.products.map((product) => (
                <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card onClick={() => navigate(`/product/${product.id}`)} sx={{ cursor: 'pointer' }}>
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
                        >
                          Add to Cart
                        </Button>
                        <Button>
                          <FavoriteBorder />
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </Container>
      <Footer />
    </>
  );
};

export default Products;