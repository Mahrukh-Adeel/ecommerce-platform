import type { UserInfo } from '../models/UserInfo';

export type AuthState = {
    user: UserInfo | null;
    accessToken: string | null;
    refreshToken: string | null;
    isLoggedIn: boolean;
    signup: (name: string, email: string, password: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    loginWithGoogle: () => void;
    handleOAuthCallback: (searchParams: URLSearchParams) => Promise<void>;
    logout: () => Promise<void>;
    setUser: (user: UserInfo) => void;
    setTokens: (accessToken: string, refreshToken?: string) => void;
    clearAuth: () => void;
    initializeAuth: () => Promise<void>;
    updateProfile: (updateData: {
      name?: string;
      email?: string;
      phone?: string;
      address?: string;
      password?: string;
    }) => Promise<void>;
};