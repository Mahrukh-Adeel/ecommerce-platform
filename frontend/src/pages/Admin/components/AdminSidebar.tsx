import React from "react";
import {
  Drawer,
  Toolbar,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Chip,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Home,
  Add,
  Inventory,
  ShoppingCart,
  People,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
  { text: "Home", icon: <Home />, path: "/" },
  { text: "Add Products", icon: <Add />, path: "/admin/add-products" },
  { text: "Manage Products", icon: <Inventory />, path: "/admin/manage-products" },
  { text: "Manage Orders", icon: <ShoppingCart />, path: "/admin/manage-orders" },
  { text: "Manage Users", icon: <People />, path: "/admin/manage-users" },
];

interface AdminSidebarProps {
  drawerWidth: number;
  container?: () => HTMLElement;
  mobileOpen?: boolean;
  onDrawerClose?: () => void;
  onDrawerTransitionEnd?: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  drawerWidth,
  container,
  mobileOpen = false,
  onDrawerClose,
  onDrawerTransitionEnd,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const drawer = (
    <Box sx={{ height: '100%', bgcolor: 'background.paper' }}>
      <Toolbar 
        sx={{ 
          bgcolor: 'secondary.main',
          borderBottom: `2px solid ${theme.palette.secondary.dark}`,
          minHeight: '64px !important'
        }}
      >
        <Typography 
          variant="h6" 
          noWrap 
          component="div" 
          sx={{ 
            fontWeight: 700,
            color: 'white',
            letterSpacing: 0.5,
            fontSize: '1.1rem'
          }}
        >
          Admin Panel
        </Typography>
        <Chip 
          label="Admin"
          size="small"
          sx={{
            ml: 'auto',
            bgcolor: `${theme.palette.background.default}26`,
            color: 'white',
            fontWeight: 600,
            fontSize: '10px',
            height: 20
          }}
        />
      </Toolbar>
      <Divider sx={{ borderColor: theme.palette.divider, borderWidth: 1 }} />
      <List sx={{ pt: 2, px: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton 
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  py: 1.5,
                  px: 2,
                  bgcolor: isActive ? `${theme.palette.primary.main}1A` : 'transparent',
                  border: isActive ? `1px solid ${theme.palette.primary.main}33` : '1px solid transparent',
                  color: isActive ? 'primary.main' : 'text.primary',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: isActive ? `${theme.palette.primary.main}26` : `${theme.palette.secondary.main}0D`,
                    transform: 'translateX(2px)',
                    boxShadow: `0 2px 8px ${theme.palette.primary.main}1A`
                  }
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    color: isActive ? 'primary.main' : 'secondary.main',
                    minWidth: 36,
                    transition: 'color 0.2s ease'
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{
                    fontSize: '14px',
                    fontWeight: isActive ? 600 : 500
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      
      <Box sx={{ mt: 'auto', p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Typography 
          variant="caption" 
          sx={{ 
            color: 'text.secondary',
            fontSize: '11px',
            textAlign: 'center',
            display: 'block'
          }}
        >
          Everwood Admin v1.0
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onTransitionEnd={onDrawerTransitionEnd}
        onClose={onDrawerClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { 
            boxSizing: "border-box", 
            width: drawerWidth,
            bgcolor: 'background.paper',
            borderRight: `2px solid ${theme.palette.divider}`
          },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": { 
            boxSizing: "border-box", 
            width: drawerWidth,
            bgcolor: 'background.paper',
            borderRight: `2px solid ${theme.palette.divider}`,
            boxShadow: `2px 0 8px ${theme.palette.primary.main}0D`
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default AdminSidebar;
