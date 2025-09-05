import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import { 
  Close as CloseIcon,
  Login as LoginIcon,
  PersonAdd as SignupIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

interface LoginRequiredAlertProps {
  open: boolean;
  onClose: () => void;
  message?: string;
}

const LoginRequiredAlert: React.FC<LoginRequiredAlertProps> = ({ 
  open, 
  onClose, 
  message = "Please log in to add items to your cart" 
}) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
    navigate('/login');
  };

  const handleSignup = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
    navigate('/signup');
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={false}
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        }
      }}
      PaperProps={{
        sx: {
          borderRadius: 3,
          bgcolor: 'background.paper',
          border: `2px solid ${theme.palette.primary.main}33`,
          zIndex: 1300,
        }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: `${theme.palette.primary.main}0D`,
          color: 'primary.main',
          fontWeight: 700,
          fontSize: '1.25rem',
          pb: 2
        }}
      >
        Login Required
        <IconButton
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
          size="small"
          sx={{
            color: 'primary.main',
            '&:hover': {
              bgcolor: `${theme.palette.primary.main}1A`
            }
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              bgcolor: `${theme.palette.secondary.main}1A`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
              border: `2px solid ${theme.palette.secondary.main}33`
            }}
          >
            <LoginIcon sx={{ fontSize: 32, color: 'secondary.main' }} />
          </Box>
          
          <Typography
            variant="body1"
            sx={{
              color: 'text.primary',
              fontSize: '16px',
              lineHeight: 1.5,
              mb: 1
            }}
          >
            {message}
          </Typography>
          
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: '14px'
            }}
          >
            Join thousands of satisfied customers and start shopping today!
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          pt: 0,
          display: 'flex',
          gap: 2,
          flexDirection: { xs: 'column', sm: 'row' }
        }}
      >
        <Button
          onClick={handleSignup}
          variant="outlined"
          startIcon={<SignupIcon fontSize="small" />}
          fullWidth
          sx={{
            py: 1.5,
            borderColor: 'secondary.main',
            color: 'secondary.main',
            fontWeight: 600,
            textTransform: 'none',
            borderRadius: 2,
            '&:hover': {
              borderColor: 'secondary.main',
              bgcolor: `${theme.palette.secondary.main}0D`,
            }
          }}
        >
          Create Account
        </Button>
        
        <Button
          onClick={handleLogin}
          variant="contained"
          startIcon={<LoginIcon fontSize="small" />}
          fullWidth
          sx={{
            py: 1.5,
            bgcolor: 'primary.main',
            color: 'white',
            fontWeight: 600,
            textTransform: 'none',
            borderRadius: 2,
            boxShadow: `0 4px 12px ${theme.palette.primary.main}33`,
            '&:hover': {
              bgcolor: 'primary.dark',
              boxShadow: `0 6px 16px ${theme.palette.primary.main}4D`,
            }
          }}
        >
          Log In
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoginRequiredAlert;
