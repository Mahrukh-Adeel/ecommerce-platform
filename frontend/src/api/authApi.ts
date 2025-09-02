import api from "./axios";

export const signupUser = async (name: string, email: string, password: string) => {
    const response = await api.post("/auth/signup", { name, email, password });
    
    if (response.data && response.data.success && response.data.user) {
        return response.data;
    }
    
    return response.data;
};

export const loginUser = async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password });
    
    if (response.data && response.data.success && response.data.user) {
        if (response.data.tokens) {
            localStorage.setItem('accessToken', response.data.tokens.accessToken);
            localStorage.setItem('refreshToken', response.data.tokens.refreshToken);
        }
        return response.data;
    }
    
    return response.data;
};

export const getCurrentUser = async () => {
    const token = localStorage.getItem('accessToken');
    const response = await api.get('/auth/me', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    
    if (response.data && response.data.success && response.data.user) {
        return response.data;
    }
    
    return response.data;
};

export const logoutUser = async () => {
    const token = localStorage.getItem('accessToken');
    
    try {
        if (token) {
            await api.post('/auth/logout', {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        }
    } finally {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
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

    // Store tokens
    if (token) {
        localStorage.setItem('accessToken', token);
    }
    if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
    }

    return { token, refreshToken };
};

// Helper function for OAuth error messages
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
