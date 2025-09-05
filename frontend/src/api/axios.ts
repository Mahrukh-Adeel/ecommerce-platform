import axios from "axios";
import { useAuthStore } from "../store/authStore";
import TokenManager from "../utils/tokenManager";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

api.interceptors.request.use(
    async (config) => {
        const validToken = await TokenManager.getInstance().ensureValidToken();
        
        if (validToken) {
            config.headers.Authorization = `Bearer ${validToken}`;
        } else {
            console.log('No valid auth token available for request:', config.url);
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                  failedQueue.push({ resolve, reject });
                }).then((token) => {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                  return api(originalRequest);
                }).catch((err) => {
                  return Promise.reject(err);
                });
            }
            
            originalRequest._retry = true;
            isRefreshing = true;
            
            const refreshToken = localStorage.getItem('refreshToken');
            
            if (refreshToken) {
                try {
                    const response = await api.post('/auth/refresh-token', { refreshToken });
                    
                    if (response.data?.success && response.data?.accessToken) {
                        const { accessToken } = response.data;
                        
                        useAuthStore.getState().setTokens(accessToken, refreshToken);
                        
                        processQueue(null, accessToken);
                        
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                        return api(originalRequest);
                    } else {
                        throw new Error('Invalid refresh response');
                    }
                } catch (refreshError) {
                    processQueue(refreshError, null);
                    
                    useAuthStore.getState().clearAuth();
                    
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            } else {
                isRefreshing = false;
                processQueue(error, null);
                useAuthStore.getState().clearAuth();
            }
        } else if (error.response?.status === 403) {
            console.log('403 Forbidden error detected');
            
            if (error.response?.data?.message?.includes('You can only access your own data')) {
                const { initializeAuth } = useAuthStore.getState();
                try {
                    await initializeAuth();
                } catch {
                    console.log('Auth reinitialization failed');
                    useAuthStore.getState().clearAuth();
                }
            }
        }
        
        return Promise.reject(error);
    }
);

export default api; 