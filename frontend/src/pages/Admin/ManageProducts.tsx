import React, { useState, useEffect } from "react";
import {
  Box,
  CssBaseline,
  Container,
  Toolbar,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Stack,
  Chip,
  Grid,
  IconButton,
} from "@mui/material";
import {
  Edit,
  Delete,
  Visibility,
} from "@mui/icons-material";
import AdminAppBar from "./components/AdminAppBar";
import AdminSidebar from "./components/AdminSidebar";
import { useAdminStore } from "../../store/adminStore";
import { fetchCategories } from "../../api/categoryApi";
import type { Category } from "../../models/Category";
import type { ProductData } from "../../models/ProductData";

const drawerWidth = 240;

const ManageProducts: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const {
    products,
    isLoadingProducts,
    productsError,
    fetchAllProducts,
    updateProduct,
    deleteProduct,
    clearErrors,
  } = useAdminStore();

  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    categoryId: '',
  });

  useEffect(() => {
    fetchAllProducts();
    
    const loadCategories = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };

    loadCategories();
  }, [fetchAllProducts]);

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

  const getCategoryName = (categoryId: string | { _id: string; name: string; image: string } | undefined) => {
    if (typeof categoryId === 'object' && categoryId?.name) {
      return categoryId.name;
    }
    
    const category = categories.find(cat => cat._id === categoryId);
    return category?.name || 'Unknown';
  };

  const handleViewProduct = (product: ProductData) => {
    setSelectedProduct(product);
    setViewDialogOpen(true);
  };

  const handleEditProduct = (product: ProductData) => {
    setSelectedProduct(product);
    const categoryId = typeof product.categoryId === 'object' 
      ? product.categoryId._id 
      : product.categoryId || '';
      
    setEditFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      image: product.image || '',
      categoryId,
    });
    setEditDialogOpen(true);
  };

  const handleDeleteProduct = (product: ProductData) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    if (selectedProduct) {
      await updateProduct(selectedProduct._id, {
        name: editFormData.name,
        description: editFormData.description,
        price: Number(editFormData.price),
        image: editFormData.image,
        categoryId: editFormData.categoryId,
      });
      setEditDialogOpen(false);
      setSelectedProduct(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedProduct) {
      await deleteProduct(selectedProduct._id);
      setDeleteDialogOpen(false);
      setSelectedProduct(null);
    }
  };

  if (isLoadingProducts) {
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
        <Box component="main" sx={{ flexGrow: 1, p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <CircularProgress size={60} />
        </Box>
      </Box>
    );
  }

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
          bgcolor: "grey.50",
        }}
      >
        <Toolbar />
        <Container maxWidth="xl">
          <Paper sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>
              Manage Products
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              View, edit, and delete products in your store
            </Typography>

            {productsError && (
              <Alert 
                severity="error" 
                sx={{ mb: 3 }}
                onClose={clearErrors}
              >
                {productsError}
              </Alert>
            )}

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product Name</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Stock Status</TableCell>
                    <TableCell>Date Added</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell>
                        <Typography variant="body1" fontWeight="medium">
                          {product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {product.description?.slice(0, 50)}...
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={getCategoryName(product.categoryId)}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <Chip
                          label={product.inStock !== false ? 'In Stock' : 'Out of Stock'}
                          color={product.inStock !== false ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(product.createdAt || '').toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <IconButton
                            size="small"
                            onClick={() => handleViewProduct(product)}
                            color="info"
                          >
                            <Visibility />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleEditProduct(product)}
                            color="primary"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteProduct(product)}
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {products.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary">
                  No products found
                </Typography>
              </Box>
            )}
          </Paper>
        </Container>

        {/* View Product Dialog */}
        <Dialog 
          open={viewDialogOpen} 
          onClose={() => setViewDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Product Details</DialogTitle>
          <DialogContent>
            {selectedProduct && (
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="h6">{selectedProduct.name}</Typography>
                  <Typography color="text.secondary" gutterBottom>
                    {getCategoryName(selectedProduct.categoryId)}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="body1">{selectedProduct.description}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }} >
                  <Typography><strong>Price:</strong> ${selectedProduct.price.toFixed(2)}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }} >
                  <Typography>
                    <strong>Status:</strong> {selectedProduct.inStock !== false ? 'In Stock' : 'Out of Stock'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12 }} >
                  <Typography><strong>Image URL:</strong> {selectedProduct.image || 'N/A'}</Typography>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Edit Product Dialog */}
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Product Name"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Description"
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  label="Price"
                  type="number"
                  value={editFormData.price}
                  onChange={(e) => setEditFormData({...editFormData, price: e.target.value})}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={editFormData.categoryId}
                    onChange={(e) => setEditFormData({...editFormData, categoryId: e.target.value})}
                    label="Category"
                  >
                    {categories.map((category) => (
                      <MenuItem key={category._id} value={category._id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12}} >
                <TextField
                  fullWidth
                  label="Image URL"
                  value={editFormData.image}
                  onChange={(e) => setEditFormData({...editFormData, image: e.target.value})}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditSubmit} variant="contained">Save Changes</Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Delete Product</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} variant="contained" color="error">Delete</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default ManageProducts;
