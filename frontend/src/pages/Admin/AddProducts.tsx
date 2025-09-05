import React, { useState, useEffect } from "react";
import {
  Box,
  CssBaseline,
  Container,
  Toolbar,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Grid,
  CircularProgress,
  Stack,
  Divider,
  Card,
  CardContent,
  InputAdornment,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { 
  Save, 
  Clear, 
  AttachMoney, 
  Image as ImageIcon,
  Description,
  Category as CategoryIcon,
  Inventory,
} from "@mui/icons-material";
import AdminAppBar from "./components/AdminAppBar";
import AdminSidebar from "./components/AdminSidebar";
import { useAdminStore } from "../../store/adminStore";
import { fetchCategories } from "../../api/categoryApi";
import type { Category } from "../../models/Category";

const drawerWidth = 240;

const AddProducts: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const { createProduct, productsError, successMessage, clearErrors, clearSuccess } = useAdminStore();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    categoryId: '',
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const categoriesData = await fetchCategories();
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      } catch (error) {
        console.error('Failed to load categories:', error);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    setFormData(prev => ({
      ...prev,
      categoryId: event.target.value
    }));
  };

  const validateForm = () => {
    return (
      formData.name.trim() &&
      formData.description.trim() &&
      formData.price &&
      !isNaN(Number(formData.price)) &&
      Number(formData.price) > 0 &&
      formData.categoryId
    );
  };

  const clearForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      image: '',
      categoryId: '',
    });
    clearSuccess();
    clearErrors();
  };

  const clearFormOnly = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      image: '',
      categoryId: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    clearErrors();
    clearSuccess();

    try {
      await createProduct({
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        image: formData.image.trim() || '/products/default.jpg',
        categoryId: formData.categoryId,
      });

      // Clear form data but keep success message visible
      clearFormOnly();
    } catch (error) {
      console.error('Failed to add product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AdminAppBar
        drawerWidth={drawerWidth}
        onMenuClick={handleDrawerToggle}
        anchorEl={anchorEl}
        onProfileMenuOpen={handleProfileMenuOpen}
        onProfileMenuClose={handleProfileMenuClose}
      />
      <AdminSidebar
        drawerWidth={drawerWidth}
        mobileOpen={mobileOpen}
        onDrawerClose={handleDrawerClose}
        onDrawerTransitionEnd={handleDrawerTransitionEnd}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        <Toolbar />
        <Container maxWidth="md">
          {/* Header Section */}
          <Card 
            elevation={2} 
            sx={{ 
              mb: 3, 
              borderRadius: 3,
              background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(25, 118, 210, 0.05) 100%)'
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                <Box 
                  sx={{ 
                    p: 1.5, 
                    borderRadius: 2, 
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Inventory sx={{ fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                    Add New Product
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Create a new product for your store inventory
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* Success and Error Messages */}
          {successMessage && (
            <Alert 
              severity="success" 
              onClose={clearSuccess}
              sx={{ mb: 3, borderRadius: 2 }}
            >
              {successMessage}
            </Alert>
          )}

          {productsError && (
            <Alert 
              severity="error" 
              onClose={clearErrors}
              sx={{ mb: 3, borderRadius: 2 }}
            >
              {productsError}
            </Alert>
          )}

          {/* Main Form */}
          <Paper 
            elevation={2} 
            sx={{ 
              borderRadius: 3,
              overflow: 'hidden'
            }}
          >
            <Box sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Product Information
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Fill in the details below to add a new product
              </Typography>
              
              <Divider sx={{ mb: 4 }} />

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  {/* Product Name */}
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Product Name"
                      value={formData.name}
                      onChange={handleInputChange('name')}
                      required
                      placeholder="Enter a descriptive product name"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Inventory sx={{ color: 'text.secondary' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ 
                        '& .MuiOutlinedInput-root': { 
                          borderRadius: 2 
                        } 
                      }}
                    />
                  </Grid>

                  {/* Description */}
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Description"
                      value={formData.description}
                      onChange={handleInputChange('description')}
                      required
                      multiline
                      rows={4}
                      placeholder="Provide a detailed description of your product"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 2 }}>
                            <Description sx={{ color: 'text.secondary' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ 
                        '& .MuiOutlinedInput-root': { 
                          borderRadius: 2 
                        } 
                      }}
                    />
                  </Grid>

                  {/* Price and Category Row */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Price"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange('price')}
                      required
                      inputProps={{ min: 0, step: 0.01 }}
                      placeholder="0.00"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AttachMoney sx={{ color: 'success.main' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ 
                        '& .MuiOutlinedInput-root': { 
                          borderRadius: 2 
                        } 
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl 
                      fullWidth 
                      required
                      sx={{ 
                        '& .MuiOutlinedInput-root': { 
                          borderRadius: 2 
                        } 
                      }}
                    >
                      <InputLabel>Category</InputLabel>
                      <Select
                        value={formData.categoryId}
                        onChange={handleSelectChange}
                        label="Category"
                        disabled={isLoadingCategories}
                        startAdornment={
                          <InputAdornment position="start">
                            <CategoryIcon sx={{ color: 'text.secondary', mr: 1 }} />
                          </InputAdornment>
                        }
                      >
                        {isLoadingCategories ? (
                          <MenuItem disabled>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <CircularProgress size={16} />
                              <Typography variant="body2">Loading categories...</Typography>
                            </Stack>
                          </MenuItem>
                        ) : categories.length === 0 ? (
                          <MenuItem disabled>
                            <Typography variant="body2" color="text.secondary">
                              No categories available
                            </Typography>
                          </MenuItem>
                        ) : (
                          categories.map((category) => (
                            <MenuItem key={category._id} value={category._id}>
                              {category.name}
                            </MenuItem>
                          ))
                        )}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Image URL */}
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Image URL (Optional)"
                      value={formData.image}
                      onChange={handleInputChange('image')}
                      placeholder="/products/category/product-name.jpg"
                      helperText="Leave empty to use default product image"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <ImageIcon sx={{ color: 'text.secondary' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ 
                        '& .MuiOutlinedInput-root': { 
                          borderRadius: 2 
                        } 
                      }}
                    />
                  </Grid>

                  {/* Form Actions */}
                  <Grid size={{ xs: 12 }}>
                    <Divider sx={{ my: 2 }} />
                    <Stack 
                      direction={{ xs: 'column', sm: 'row' }} 
                      spacing={2} 
                      justifyContent="flex-end"
                      sx={{ mt: 3 }}
                    >
                      <Button
                        type="button"
                        variant="outlined"
                        startIcon={<Clear />}
                        onClick={clearForm}
                        disabled={isSubmitting}
                        sx={{ 
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 600,
                          px: 3,
                          py: 1.2
                        }}
                      >
                        Clear Form
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Save />}
                        disabled={!validateForm() || isSubmitting}
                        sx={{ 
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 600,
                          px: 3,
                          py: 1.2,
                          minWidth: 140
                        }}
                      >
                        {isSubmitting ? 'Adding Product...' : 'Add Product'}
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default AddProducts;