import api from "./axios";
import { useAuthStore } from '../store/authStore';

export const signupUser = async (name: string, email: string, password: string) => {
    const response = await api.post("/auth/signup", { name, email, password });
    
    if (response.data && response.data.success && response.data.user) {
        return response.data;
    }
    
    return response.data;
};

export const loginUser = async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password });
    
    return response.data;
};

export const getCurrentUser = async () => {
    const response = await api.get('/auth/me');
    
    if (response.data && response.data.success && response.data.user) {
        return response.data;
    }
    
    return response.data;
};

export const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
        throw new Error('No refresh token available');
    }
    
    const response = await api.post('/auth/refresh-token', { refreshToken });
    
    if (response.data && response.data.success && response.data.accessToken) {
        const { accessToken } = response.data;
        useAuthStore.getState().setTokens(accessToken, refreshToken);
        return response.data;
    }
    
    throw new Error('Failed to refresh token');
};

export const logoutUser = async () => {
    try {
        await api.post('/auth/logout');
    } finally {
        // Clear Zustand state
        useAuthStore.getState().clearAuth();
    }
};

export const initiateGoogleAuth = () => {
    const baseURL = api.defaults.baseURL;
    window.location.href = `${baseURL}/auth/google`;
};

export const handleGoogleCallback = (searchParams: URLSearchParams) => {
    const token = searchParams.get('token');
    const refreshToken = searchParams.get('refresh');
    const error = searchParams.get('error');

    if (error) {
        throw new Error(getOAuthErrorMessage(error));
    }

    if (!token) {
        throw new Error('No authentication token received');
    }

    // Store tokens in Zustand
    useAuthStore.getState().setTokens(token, refreshToken || undefined);

    return { token, refreshToken };
};

const getOAuthErrorMessage = (error: string): string => {
    switch (error) {
        case 'auth_failed':
            return 'Google authentication failed. Please try again.';
        case 'server_error':
            return 'Server error during authentication. Please try again later.';
        default:
            return 'Authentication error occurred. Please try again.';
    }
};