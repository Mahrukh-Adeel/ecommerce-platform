import {
  Box,
  Toolbar,
  Typography,
  Container,
  Grid,
  Paper,
  Button,
} from "@mui/material";
import {
  Add,
  Inventory,
  ShoppingCart,
  Home,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

interface DashboardProps {
  window?: () => Window;
}

const Dashboard: React.FC<DashboardProps> = () => {
  const navigate = useNavigate();

  return (
    <Container sx={{ display: "flex", minHeight: "100vh", minWidth: "100vw" }}>

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
        
        <Container maxWidth="lg">
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Welcome back, Admin!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Here's what's happening with your store today.
            </Typography>
          </Box>

          <Grid container spacing={3} sx={{ mb: 4}}>
            <Grid size={{ xs: 12, md: 6, }}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2,  }}>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate("/admin/add-products")}
                    fullWidth
                  >
                    Add New Product
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<ShoppingCart />}
                    onClick={() => navigate("/admin/manage-orders")}
                    fullWidth
                  >
                    Manage Orders
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Inventory />}
                    onClick={() => navigate("/admin/manage-products")}
                    fullWidth
                  >
                    View All Products
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Home />}
                    onClick={() => navigate("/")}
                    fullWidth
                  >
                    Go To Home
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Container>
  );
};

export default Dashboard;