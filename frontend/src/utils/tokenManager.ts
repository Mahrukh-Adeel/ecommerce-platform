import { useAuthStore } from '../store/authStore';
import api from '../api/axios';

class TokenManager {
  private static instance: TokenManager;
  private refreshTimer: NodeJS.Timeout | null = null;
  private isRefreshing = false;

  private constructor() {}

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  private parseTokenExpiration(token: string): number {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000; // Convert to milliseconds
    } catch (error) {
      console.error('Failed to parse token:', error);
      return 0;
    }
  }

  private isTokenExpiringSoon(token: string, bufferMinutes: number = 5): boolean {
    const expirationTime = this.parseTokenExpiration(token);
    const bufferTime = bufferMinutes * 60 * 1000; // Convert to milliseconds
    return Date.now() + bufferTime >= expirationTime;
  }

  private async refreshAccessToken(): Promise<string | null> {
    if (this.isRefreshing) {
      return new Promise((resolve) => {
        const checkRefresh = () => {
          if (!this.isRefreshing) {
            resolve(useAuthStore.getState().accessToken);
          } else {
            setTimeout(checkRefresh, 100);
          }
        };
        checkRefresh();
      });
    }

    this.isRefreshing = true;

    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post('/auth/refresh-token', { refreshToken });

      if (response.data?.success && response.data?.accessToken) {
        const newAccessToken = response.data.accessToken;
        
        useAuthStore.getState().setTokens(newAccessToken, refreshToken);
        
        
        this.scheduleTokenRefresh(newAccessToken);
        
        return newAccessToken;
      } else {
        throw new Error('Invalid refresh response');
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      
      useAuthStore.getState().clearAuth();
      
      return null;
    } finally {
      this.isRefreshing = false;
    }
  }

  private scheduleTokenRefresh(token: string): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    const expirationTime = this.parseTokenExpiration(token);
    const refreshTime = expirationTime - Date.now() - (10 * 60 * 1000); // Refresh 10 minutes before expiration

    if (refreshTime > 0) {
      
      this.refreshTimer = setTimeout(() => {
        this.refreshAccessToken();
      }, refreshTime);
    } else {
      console.log('Token expired or expiring soon, refreshing immediately');
      this.refreshAccessToken();
    }
  }

  initializeTokenManagement(): void {
    const { accessToken } = useAuthStore.getState();
    
    if (accessToken) {
      this.scheduleTokenRefresh(accessToken);
    }
  }

  async ensureValidToken(): Promise<string | null> {
    const { accessToken } = useAuthStore.getState();
    
    if (!accessToken) {
      console.log('No access token available');
      return null;
    }

    if (this.isTokenExpiringSoon(accessToken)) {
      console.log('Token expiring soon, refreshing...');
      return await this.refreshAccessToken();
    }

    return accessToken;
  }

  clearTokenManagement(): void {
    
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
    
    this.isRefreshing = false;
  }

  getTimeUntilExpiration(): number {
    const { accessToken } = useAuthStore.getState();
    
    if (!accessToken) {
      return 0;
    }

    const expirationTime = this.parseTokenExpiration(accessToken);
    const timeLeft = expirationTime - Date.now();
    
    return Math.max(0, Math.round(timeLeft / 1000 / 60));
  }
}

export default TokenManager;