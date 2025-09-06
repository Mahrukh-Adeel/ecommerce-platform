import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Link,
  Alert,
  Divider
} from '@mui/material';
import { Person, Email, Lock, Google } from '@mui/icons-material';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const SignupPage: React.FC = () => {
  const { signup, loginWithGoogle } = useAuthStore();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitMessage, setSubmitMessage] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');
    
    try {
      const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`;
      await signup(fullName, formData.email, formData.password);
      
      setSubmitMessage('Account created successfully! Welcome to Everwood!');
      
      // Navigate to home page after successful signup
      setTimeout(() => {
        navigate('/');
      }, 1500);
      
    } catch (error) {
      console.error('Signup failed:', error);
      setSubmitMessage(error instanceof Error ? error.message : 'Failed to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = () => {
    loginWithGoogle();
  };

  return (
    <Container 
      maxWidth="sm" 
      sx={{
        py: { xs: 4, sm: 6, md: 8 },
        px: { xs: 2, sm: 3 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default'
      }}
    >
      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 3, sm: 4, md: 5 }, 
          borderRadius: 2, 
          width: '100%', 
          maxWidth: { xs: '100%', sm: 450, md: 500 }, 
          mx: 'auto' 
        }}
      >
        <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 4 } }}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            sx={{ 
              color: 'primary.main', 
              fontWeight: 'bold',
              fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
              mb: 2
            }}
          >
            Join Everwood
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}
          >
            Create your account and start furnishing your dream space
          </Typography>
        </Box>

        {submitMessage && (
          <Alert 
            severity={submitMessage.includes('successfully') ? 'success' : 'error'} 
            sx={{ mb: 3 }}
          >
            {submitMessage}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          {/* First Name */}
          <TextField
            fullWidth
            name="firstName"
            label="First Name"
            value={formData.firstName}
            onChange={handleChange}
            error={!!errors.firstName}
            helperText={errors.firstName}
            margin="normal"
            size={window.innerWidth < 600 ? "small" : "medium"}
            InputProps={{
              startAdornment: <Person sx={{ color: 'action.active', mr: 1 }} />
            }}
          />

          {/* Last Name */}
          <TextField
            fullWidth
            name="lastName"
            label="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            error={!!errors.lastName}
            helperText={errors.lastName}
            margin="normal"
            size={window.innerWidth < 600 ? "small" : "medium"}
            InputProps={{
              startAdornment: <Person sx={{ color: 'action.active', mr: 1 }} />
            }}
          />

          {/* Email */}
          <TextField
            fullWidth
            name="email"
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            margin="normal"
            size={window.innerWidth < 600 ? "small" : "medium"}
            InputProps={{
              startAdornment: <Email sx={{ color: 'action.active', mr: 1 }} />
            }}
          />

          {/* Password */}
          <TextField
            fullWidth
            name="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            margin="normal"
            size={window.innerWidth < 600 ? "small" : "medium"}
            InputProps={{
              startAdornment: <Lock sx={{ color: 'action.active', mr: 1 }} />
            }}
          />

          {/* Confirm Password */}
          <TextField
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            margin="normal"
            size={window.innerWidth < 600 ? "small" : "medium"}
            InputProps={{
              startAdornment: <Lock sx={{ color: 'action.active', mr: 1 }} />
            }}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isSubmitting}
            size={window.innerWidth < 600 ? "medium" : "large"}
            sx={{
              mt: 3,
              mb: 2,
              py: { xs: 1.25, sm: 1.5 },
              fontSize: { xs: '0.875rem', sm: '1rem' },
              fontWeight: 600,
              bgcolor: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.dark'
              }
            }}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </Button>

          {/* Google Signup Button */}
          <Divider sx={{ my: 2 }}>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              OR
            </Typography>
          </Divider>
          
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Google />}
            onClick={handleGoogleSignup}
            size={window.innerWidth < 600 ? "medium" : "large"}
            sx={{
              mb: 2,
              py: { xs: 1.25, sm: 1.5 },
              fontSize: { xs: '0.875rem', sm: '1rem' },
              fontWeight: 500,
              borderColor: 'grey.300',
              color: 'text.primary',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'grey.50'
              }
            }}
          >
            Continue with Google
          </Button>

          {/* Login Link */}
          <Box sx={{ textAlign: 'center', mt: { xs: 2, sm: 3 } }}>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
            >
              Already have an account?{' '}
              <Link 
                href="/login" 
                sx={{ 
                  color: 'secondary.main',
                  textDecoration: 'none',
                  fontWeight: 500,
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                Sign in here
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignupPage;