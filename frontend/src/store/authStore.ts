import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserInfo } from '../models/UserInfo';
import { signupUser, loginUser, initiateGoogleAuth, handleGoogleCallback, getCurrentUser, logoutUser } from '../api/authApi';

interface AuthState {
  user: UserInfo | null;
  isLoggedIn: boolean;
  signup: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => void;
  handleOAuthCallback: (searchParams: URLSearchParams) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: UserInfo) => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,

      signup: async (name: string, email: string, password: string) => {
        try {
          const response = await signupUser(name, email, password);
          
          if (response.success && response.user) {
            const user: UserInfo = {
              id: response.user.id,
              email: response.user.email,
              name: response.user.name,
              role: response.user.role
            };
            set({ user, isLoggedIn: true });
          } else {
            throw new Error(response.message || 'Signup failed');
          }
        } catch (error) {
          console.error('Signup failed:', error);
          throw error;
        }
      },

      login: async (email: string, password: string) => {
        try {
          const response = await loginUser(email, password);
          
          if (response.success && response.user) {
            const user: UserInfo = {
              id: response.user.id,
              email: response.user.email,
              name: response.user.firstName && response.user.lastName 
                ? `${response.user.firstName} ${response.user.lastName}`
                : response.user.email.split('@')[0],
              role: response.user.role,
              token: response.tokens?.accessToken
            };
            set({ user, isLoggedIn: true });
          } else {
            throw new Error(response.message || 'Login failed');
          }
        } catch (error) {
          console.error('Login failed:', error);
          throw error;
        }
      },

      logout: async () => {
        try {
          await logoutUser();
          set({ user: null, isLoggedIn: false });
        } catch (error) {
          console.error('Logout failed:', error);
          // Still clear local state even if API call fails
          set({ user: null, isLoggedIn: false });
        }
      },

      loginWithGoogle: () => {
        initiateGoogleAuth();
      },

      handleOAuthCallback: async (searchParams: URLSearchParams) => {
        try {
          // Handle the callback and store tokens
          handleGoogleCallback(searchParams);
          
          // Get user info from API using the stored token
          const userResponse = await getCurrentUser();
          
          if (userResponse.success && userResponse.user) {
            const user: UserInfo = {
              id: userResponse.user.id,
              email: userResponse.user.email,
              name: userResponse.user.name,
              role: userResponse.user.role,
              token: localStorage.getItem('accessToken') || undefined
            };
            set({ user, isLoggedIn: true });
          } else {
            throw new Error('Failed to get user info after OAuth');
          }
        } catch (error) {
          console.error('OAuth callback failed:', error);
          throw error;
        }
      },

      initializeAuth: async () => {
        try {
          const token = localStorage.getItem('accessToken');
          if (token) {
            const response = await getCurrentUser();
            
            if (response.success && response.user) {
              const user: UserInfo = {
                id: response.user.id,
                email: response.user.email,
                name: response.user.name,
                role: response.user.role,
                token: token
              };
              set({ user, isLoggedIn: true });
            } else {
              throw new Error('Invalid user data');
            }
          }
        } catch (error) {
          console.error('Auth initialization failed:', error);
          // Clear invalid tokens
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          set({ user: null, isLoggedIn: false });
        }
      },

      setUser: (user: UserInfo) => {
        set({ user, isLoggedIn: true });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isLoggedIn: state.isLoggedIn }),
    }
  )
);