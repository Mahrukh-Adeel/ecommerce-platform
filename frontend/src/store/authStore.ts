import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserInfo } from '../models/UserInfo';
import { signupUser, loginUser, initiateGoogleAuth, handleGoogleCallback, getCurrentUser, logoutUser } from '../api/authApi';
import { updateUserProfile } from '../api/userApi';
import type { AuthState } from '../types/authState';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoggedIn: false,

      setTokens: (accessToken: string, refreshToken?: string) => {
        set({ accessToken, refreshToken: refreshToken || null });
        localStorage.setItem('accessToken', accessToken);
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
      },

      clearAuth: () => {
        set({ 
          user: null, 
          isLoggedIn: false, 
          accessToken: null, 
          refreshToken: null 
        });
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      },

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
                        
            if (response.tokens) {
              set({ 
                user, 
                isLoggedIn: true,
                accessToken: response.tokens.accessToken,
                refreshToken: response.tokens.refreshToken
              });
              localStorage.setItem('accessToken', response.tokens.accessToken);
              localStorage.setItem('refreshToken', response.tokens.refreshToken);
            } else {
              set({ user, isLoggedIn: true });
            }
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
          set({ 
            user: null, 
            isLoggedIn: false, 
            accessToken: null, 
            refreshToken: null 
          });
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        } catch (error) {
          console.error('Logout failed:', error);
          set({ 
            user: null, 
            isLoggedIn: false, 
            accessToken: null, 
            refreshToken: null 
          });
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      },

      loginWithGoogle: () => {
        initiateGoogleAuth();
      },

      handleOAuthCallback: async (searchParams: URLSearchParams) => {
        try {
          const { token, refreshToken } = handleGoogleCallback(searchParams);
          
          set({ 
            accessToken: token, 
            refreshToken: refreshToken || null 
          });
          
          const userResponse = await getCurrentUser();
          
          if (userResponse.success && userResponse.user) {
            const user: UserInfo = {
              id: userResponse.user.id,
              email: userResponse.user.email,
              name: userResponse.user.name,
              phone: userResponse.user.phone,
              address: userResponse.user.address,
              role: userResponse.user.role,
              token: token
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
          const refreshToken = localStorage.getItem('refreshToken');
          const persistedUser = useAuthStore.getState().user;
          
          if (token) {
            set({ accessToken: token, refreshToken: refreshToken || null });
            
            try {
              const response = await getCurrentUser();
              
              if (response.success && response.user) {
                const user: UserInfo = {
                  id: response.user.id,
                  email: response.user.email,
                  name: response.user.name,
                  phone: response.user.phone,
                  address: response.user.address,
                  role: response.user.role,
                  token: token
                };
                
                if (persistedUser && String(persistedUser.id) !== String(response.user.id)) {
                  // User ID mismatch detected, using new user data
                }
                
                set({ user, isLoggedIn: true });
              } else {
                throw new Error('Invalid user data');
              }
            } catch (apiError: unknown) {
              // If getCurrentUser fails with 401, the axios interceptor will try to refresh
              // If refresh also fails, it will clear auth automatically
              
              // Only clear auth if it's not a token refresh scenario
              if (apiError && typeof apiError === 'object' && 'response' in apiError) {
                const error = apiError as { response?: { status?: number } };
                if (error.response?.status !== 401) {
                  throw apiError;
                }
              } else {
                throw apiError;
              }
              // For 401 errors, let the axios interceptor handle token refresh
            }
          } else {
            set({ 
              user: null, 
              isLoggedIn: false, 
              accessToken: null, 
              refreshToken: null 
            });
          }
        } catch (error) {
          console.error('Auth initialization failed:', error);
          // Clear invalid tokens and state
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          set({ 
            user: null, 
            isLoggedIn: false, 
            accessToken: null, 
            refreshToken: null 
          });
        }
      },

      updateProfile: async (updateData: {
        name?: string;
        email?: string;
        phone?: string;
        address?: string;
        password?: string;
      }) => {
        try {
          const currentUser = useAuthStore.getState().user;
          if (!currentUser) {
            throw new Error('User not logged in');
          }

          const userId = String(currentUser.id);
          
          const response = await updateUserProfile(userId, updateData);
          
          if (response.success && response.data) {
            const updatedUser: UserInfo = {
              id: response.data._id,
              email: response.data.email,
              name: response.data.name,
              phone: response.data.phone,
              address: response.data.address,
              role: response.data.role,
              isVerified: response.data.isVerified,
              joinDate: response.data.joinDate,
              avatar: response.data.avatar,
              provider: response.data.provider,
              token: currentUser.token
            };
            set({ user: updatedUser });
          } else {
            throw new Error(response.message || 'Update failed');
          }
        } catch (error) {
          console.error('Profile update failed:', error);
          throw error;
        }
      },

      setUser: (user: UserInfo) => {
        set({ user, isLoggedIn: true });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isLoggedIn: state.isLoggedIn,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken
      }),
    }
  )
);