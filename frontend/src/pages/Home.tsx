import Button from '@mui/material/Button';
import NavBar from "../components/Navbar";
import Footer from '../components/Footer';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, CardMedia, CircularProgress, Container, Grid, Paper, Typography, Alert } from '@mui/material';
import { ArrowForward, LocalShipping, Refresh, Security, Support } from '@mui/icons-material';
import { useEffect } from 'react';
import type { MouseEvent, ReactElement } from 'react';
import { useCategoriesStore } from '../store/categoriesStore';

type Feature = {
  icon: ReactElement;
  title: string;
  desc: string;
};

const features: Feature[] = [
  { icon: <LocalShipping />, title: 'Free Delivery', desc: 'On orders over 500' },
  { icon: <Security />, title: '2 Year Warranty', desc: 'On all furniture' },
  { icon: <Refresh />, title: 'Easy Returns', desc: '30-day return policy' },
  { icon: <Support />, title: '24/7 Support', desc: 'Expert help anytime' }
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    categories, 
    loading, 
    error, 
    fetchAllCategories 
  } = useCategoriesStore();

  useEffect(() => {
    if (location.hash === "#categories") {
      const el = document.getElementById("categories");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }

    const fetchData = async() => {
      try {
        await fetchAllCategories();
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    
    if (categories.length === 0) {
      fetchData();
    }
  }, [location, fetchAllCategories, categories.length]); 

  const goToCatalog = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const doc = document.getElementById('categories');
    if (doc) doc.scrollIntoView({ behavior: 'smooth' });
  };

  const goToProducts = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate("/products");
  };

  return (
    <>
      {/* Navigation Bar */}
      <NavBar />
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(#4e2a1eb3, #4e2a1eb3), url(/home/hero.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          minWidth: '100vw',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Find Your Perfect
            <br />
            <Box component="span" sx={{ color: '#8A9A5B', textShadow: '2px 2px 4px rgba(0,0,0,0.3)'}}>Furniture Match</Box>
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Transform your space with our carefully curated collection of modern and timeless furniture pieces
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              size="large" 
              sx={{ 
                bgcolor: '#8A9A5B', 
                '&:hover': { bgcolor: '#7A8A4B' },
                px: 4, py: 1.5
              }}
              endIcon={<ArrowForward />}
              onClick={goToProducts}
            >
              Shop Now
            </Button>
            <Button 
              variant="outlined" 
              onClick={goToCatalog}
              size="large"
              sx={{ 
                borderColor: 'white', 
                color: 'white',
                '&:hover': { borderColor: '#8A9A5B', bgcolor: '#8a9a5b1a' },
                px: 4, py: 1.5
              }}
            >
              Browse Catalog
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Shop by Category Section */}
      <Box id="categories" sx={{ mb: 8, pt: 4 }}>
        <Typography 
          variant="h3" 
          align="center" 
          gutterBottom 
          sx={{ m: 4, mb: 4, color: 'text.primary', textDecoration: 'underline', textDecorationColor: (theme) => theme.palette.secondary.main, fontWeight: 'bold' }}>
          Shop by Category
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Alert severity="error" sx={{ maxWidth: 600 }}>
              {error}
            </Alert>
          </Box>
        ) : (
          <Grid container spacing={5} sx={{ px: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {Array.isArray(categories) && categories.map((category) => (
              <Grid key={category._id || category.name} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': { 
                      transform: 'translateY(-8px)',
                      boxShadow: 4
                    }
                  }}
                  onClick={() => navigate(`/categories/${category._id}`)}
                >
                  <CardMedia
                    component="img"
                    height="300"
                    image={category.image}
                    alt={`Image of ${category.name}`}
                  />
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                      {category.name}
                    </Typography>
                    {category.description && (
                      <Typography variant="body2" color="text.secondary">
                        {category.description}
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary">
                      {category.countDisplay || `${category.count} items`}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
      
      {/* Features */}
      <Paper elevation={2} sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2 }}>
          <Typography 
            variant="h4" 
            align="center" 
            gutterBottom 
            sx={{ m: 4, mb: 4, color: 'text.primary', textDecoration: 'underline', textDecorationColor: (theme) => theme.palette.secondary.main, fontWeight: 'bold' }}>
            Why choose Everwood?
          </Typography>
          <Grid container spacing={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {features.map((feature, index) => (
              <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }} sx={{ mt: 2, mb: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ 
                    color: 'secondary.main', 
                    mb: 2,
                    '& svg': { fontSize: 48 }
                  }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>

      {/* Footer */}
      <Footer />
    </>
  );
}

export default Home;