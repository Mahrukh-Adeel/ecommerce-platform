export interface ApiError {
  response?: {
    status?: number;
    data?: {
      message?: string;
      error?: string;
    };
  };
  message?: string;
  code?: string;
}

export const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const apiError = error as ApiError;
    
    if (apiError.response?.data?.message) {
      return apiError.response.data.message;
    }
    
    if (apiError.response?.status) {
      return getHttpStatusMessage(apiError.response.status);
    }
  }
  
  if (error instanceof Error) {
    return error.message || 'An unexpected error occurred';
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unexpected error occurred. Please try again.';
};

export const getHttpStatusMessage = (status: number): string => {
  switch (status) {
    case 401:
      return 'Invalid credentials. Please check your email and password.';
    case 403:
      return 'Access denied. You don\'t have permission to perform this action.';
    case 400:
      return 'Invalid request. Please check your input and try again.';
    case 404:
      return 'The requested resource was not found.';
    case 409:
      return 'This data already exists. Please try with different information.';
    case 422:
      return 'Invalid data provided. Please check your input.';
    case 429:
      return 'Too many requests. Please wait a moment and try again.';
    
    // Server errors
    case 500:
      return 'Server error. Please try again later.';
    case 502:
      return 'Service temporarily unavailable. Please try again later.';
    case 503:
      return 'Service unavailable. Please try again later.';
    case 504:
      return 'Request timeout. Please try again.';
    
    // Network errors
    case 0:
      return 'Network error. Please check your internet connection.';
    
    default:
      if (status >= 500) {
        return 'Server error. Please try again later.';
      } else if (status >= 400) {
        return 'Request error. Please check your input and try again.';
      }
      return 'An unexpected error occurred. Please try again.';
  }
};

export const getAuthErrorMessage = (error: unknown): string => {
  const message = getErrorMessage(error);
  
  if (message.toLowerCase().includes('invalid credentials') || 
      message.toLowerCase().includes('unauthorized') ||
      message.toLowerCase().includes('wrong password')) {
    return 'Invalid email or password. Please check your credentials and try again.';
  }
  
  if (message.toLowerCase().includes('user not found') ||
      message.toLowerCase().includes('account not found')) {
    return 'No account found with this email address.';
  }
  
  if (message.toLowerCase().includes('email already exists') ||
      message.toLowerCase().includes('user already exists')) {
    return 'An account with this email already exists. Please try logging in instead.';
  }
  
  if (message.toLowerCase().includes('token expired') ||
      message.toLowerCase().includes('session expired')) {
    return 'Your session has expired. Please log in again.';
  }
  
  if (message.toLowerCase().includes('weak password') ||
      message.toLowerCase().includes('password too short')) {
    return 'Password is too weak. Please use at least 8 characters with letters, numbers, and symbols.';
  }
  
  return message;
};

export const getProductErrorMessage = (error: unknown): string => {
  const message = getErrorMessage(error);
  
  if (message.toLowerCase().includes('product not found')) {
    return 'Product not found. It may have been removed or is no longer available.';
  }
  
  if (message.toLowerCase().includes('out of stock') ||
      message.toLowerCase().includes('insufficient stock')) {
    return 'This product is currently out of stock.';
  }
  
  if (message.toLowerCase().includes('duplicate product') ||
      message.toLowerCase().includes('product already exists')) {
    return 'A product with this name already exists.';
  }
  
  if (message.toLowerCase().includes('invalid category')) {
    return 'Please select a valid category for this product.';
  }
  
  if (message.toLowerCase().includes('price')) {
    return 'Please enter a valid price for this product.';
  }
  
  return message;
};

export const getOrderErrorMessage = (error: unknown): string => {
  const message = getErrorMessage(error);
  
  if (message.toLowerCase().includes('order not found')) {
    return 'Order not found. Please check your order number.';
  }
  
  if (message.toLowerCase().includes('payment failed') ||
      message.toLowerCase().includes('payment error')) {
    return 'Payment processing failed. Please try again or use a different payment method.';
  }
  
  if (message.toLowerCase().includes('address')) {
    return 'Please provide a valid delivery address.';
  }
  
  if (message.toLowerCase().includes('cart empty') ||
      message.toLowerCase().includes('no items')) {
    return 'Your cart is empty. Please add items before placing an order.';
  }
  
  return message;
};

export const getNetworkErrorMessage = (error: unknown): string => {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const networkError = error as { code?: string };
    
    switch (networkError.code) {
      case 'NETWORK_ERROR':
      case 'ERR_NETWORK':
        return 'Network connection failed. Please check your internet connection.';
      case 'ECONNREFUSED':
        return 'Unable to connect to server. Please try again later.';
      case 'TIMEOUT':
      case 'ERR_TIMEOUT':
        return 'Request timed out. Please try again.';
      default:
        return getErrorMessage(error);
    }
  }
  
  return getErrorMessage(error);
};

export const logAndGetErrorMessage = (error: unknown, context?: string): string => {
  const friendlyMessage = getErrorMessage(error);
  
  if (context) {
    console.error(`Error in ${context}:`, error);
  } else {
    console.error('Application error:', error);
  }
  
  return friendlyMessage;
};