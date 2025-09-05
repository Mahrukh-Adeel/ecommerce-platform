import api from './axios';
import type { 
  WishlistItem, 
  WishlistResponse
} from '../types/wishlist';

export const getWishlist = async (userId: string): Promise<WishlistItem[]> => {
  try {
    const response = await api.get<WishlistResponse>(`/wishlist/${userId}`);
    return Array.isArray(response.data.data) ? response.data.data : [];
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    throw error;
  }
};

export const addToWishlist = async (productId: string): Promise<WishlistItem> => {
  try {
    const response = await api.post<WishlistResponse>('/wishlist/add', { productId });
    if (response.data.success && response.data.data && !Array.isArray(response.data.data)) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to add to wishlist');
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    throw error;
  }
};

export const removeFromWishlist = async (productId: string): Promise<void> => {
  try {
    const response = await api.delete<WishlistResponse>('/wishlist/remove', {
      data: { productId }
    });
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to remove from wishlist');
    }
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    throw error;
  }
};