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
  Box,
} from "@mui/material";
import { Menu as MenuIcon, Person, Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useAuthStore } from "../../../store/authStore";

interface AdminAppBarProps {
  drawerWidth: number;
  onMenuClick?: () => void;
  anchorEl: null | HTMLElement;
  onProfileMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
  onProfileMenuClose: () => void;
}

function AdminAppBar(props: AdminAppBarProps) {
  const { drawerWidth, onMenuClick, anchorEl, onProfileMenuOpen, onProfileMenuClose } = props;
  const theme = useTheme();
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      onProfileMenuClose();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      onProfileMenuClose();
    }
  };

  return (
    <AppBar
      position="fixed"
      elevation={2}
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        bgcolor: 'primary.main',
        borderBottom: `1px solid ${theme.palette.primary.dark}`,
        boxShadow: `0 2px 8px ${theme.palette.primary.main}26`,
      }}
    >
      <Toolbar sx={{ minHeight: '64px !important' }}>
        {onMenuClick && (
          <IconButton
            color="inherit"
            edge="start"
            onClick={onMenuClick}
            sx={{ 
              mr: 2, 
              display: { sm: "none" },
              color: 'background.default',
              '&:hover': {
                bgcolor: `${theme.palette.background.default}1A`
              }
            }}
          >
            <MenuIcon />
          </IconButton>
        )}
        
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography 
            variant="h5" 
            noWrap 
            sx={{ 
              flexGrow: 1,
              color: 'background.default',
              fontWeight: 700,
              letterSpacing: 0.5,
              fontSize: { xs: '1.25rem', md: '1.5rem' }
            }}
          >
            Admin Dashboard
          </Typography>
        </Box>

        <IconButton 
          color="inherit" 
          onClick={onProfileMenuOpen}
          sx={{
            color: 'background.default',
            '&:hover': {
              bgcolor: `${theme.palette.background.default}1A`
            }
          }}
        >
          <Avatar 
            sx={{ 
              width: 36, 
              height: 36,
              bgcolor: 'secondary.main',
              color: 'white',
              fontWeight: 600,
              border: `2px solid ${theme.palette.background.default}33`
            }}
          >
            <Person fontSize="small" />
          </Avatar>
        </IconButton>
        
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={onProfileMenuClose}
          PaperProps={{
            elevation: 8,
            sx: {
              bgcolor: 'background.paper',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              minWidth: 180,
              '& .MuiMenuItem-root': {
                color: 'text.primary',
                py: 1.5,
                px: 2,
                '&:hover': {
                  bgcolor: `${theme.palette.primary.main}0D`,
                  color: 'primary.main'
                }
              }
            }
          }}
        >
          <MenuItem onClick={() => {
            onProfileMenuClose();
            navigate("/profile");
          }}>
            <ListItemIcon sx={{ color: 'primary.main' }}>
              <Person fontSize="small" />
            </ListItemIcon>
            Profile
          </MenuItem>
          <Divider sx={{ borderColor: theme.palette.divider }} />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon sx={{ color: 'error.main' }}>
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