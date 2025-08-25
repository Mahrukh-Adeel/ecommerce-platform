import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
} from "@mui/material";
import { Menu as MenuIcon, Person, Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface AdminAppBarProps {
  drawerWidth: number;
  onMenuClick?: () => void;
  anchorEl: null | HTMLElement;
  onProfileMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
  onProfileMenuClose: () => void;
}

function AdminAppBar(props: AdminAppBarProps) {
  const { drawerWidth, onMenuClick, anchorEl, onProfileMenuOpen, onProfileMenuClose } = props;
  const navigate = useNavigate();

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
      }}
    >
      <Toolbar>
        {onMenuClick && (
          <IconButton
            color="inherit"
            edge="start"
            onClick={onMenuClick}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
          Dashboard
        </Typography>
        <IconButton color="inherit" onClick={onProfileMenuOpen}>
          <Avatar sx={{ width: 32, height: 32 }}>
            <Person />
          </Avatar>
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={onProfileMenuClose}
        >
          <MenuItem onClick={() => navigate("/profile")}>
            <ListItemIcon>
              <Person fontSize="small" />
            </ListItemIcon>
            Profile
          </MenuItem>
          <Divider />
          <MenuItem onClick={onProfileMenuClose}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default AdminAppBar;