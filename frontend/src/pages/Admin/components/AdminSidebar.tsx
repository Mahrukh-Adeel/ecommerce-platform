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
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Home,
  Add,
  Inventory,
  ShoppingCart,
  People,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

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

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: "bold" }}>
          Admin Panel
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => navigate(item.path)}>
              <ListItemIcon sx={{ color: "primary.main" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
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
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default AdminSidebar;
