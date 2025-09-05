import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Alert, Typography } from '@mui/material';
import { useAuthStore } from '../store/authStore';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { user, isLoggedIn, initializeAuth } = useAuthStore();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const token = localStorage.getItem('accessToken');
        
        if (!user && token) {
          await initializeAuth();
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('AdminProtectedRoute: Auth initialization failed:', err);
        setError('Authentication failed. Please log in again.');
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [user, isLoggedIn, initializeAuth]);

  if (isLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="body1" color="text.secondary">
          Verifying admin access...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          p: 3
        }}
      >
        <Alert severity="error" sx={{ maxWidth: 500 }}>
          <Typography variant="h6" gutterBottom>
            Authentication Error
          </Typography>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!isLoggedIn || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== 'admin') {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          p: 3
        }}
      >
        <Alert severity="error" sx={{ maxWidth: 500 }}>
          <Typography variant="h6" gutterBottom>
            Access Denied
          </Typography>
          <Typography variant="body1">
            You don't have administrator privileges to access this page.
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Current role: {user.role || 'user'}
          </Typography>
        </Alert>
      </Box>
    );
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;