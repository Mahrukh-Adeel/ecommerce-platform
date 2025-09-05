import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WishlistState } from '../types/wishlist';
import { getWishlist, addToWishlist, removeFromWishlist } from '../api/wishlistApi';

interface WishlistStore extends WishlistState {
  // Actions
  fetchWishlist: (userId: string) => Promise<void>;
  addItemToWishlist: (productId: string) => Promise<void>;
  removeItemFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  getWishlistCount: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      loading: false,
      error: null,

      fetchWishlist: async (userId: string) => {
        set({ loading: true, error: null });
        try {
          const items = await getWishlist(userId);
          set({ items, loading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch wishlist';
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      addItemToWishlist: async (productId: string) => {
        set({ loading: true, error: null });
        try {
          const newItem = await addToWishlist(productId);
          set((state) => ({
            items: [newItem, ...state.items],
            loading: false
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to add to wishlist';
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      removeItemFromWishlist: async (productId: string) => {
        set({ loading: true, error: null });
        try {
          await removeFromWishlist(productId);
          set((state) => ({
            items: state.items.filter(item => item.productId._id !== productId),
            loading: false
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to remove from wishlist';
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      isInWishlist: (productId: string) => {
        const { items } = get();
        return items.some(item => item.productId._id === productId);
      },

      getWishlistCount: () => {
        const { items } = get();
        return items.length;
      },

      clearWishlist: () => {
        set({ items: [], error: null, loading: false });
      },
    }),
    {
      name: 'wishlist-storage',
      partialize: (state) => ({
        items: state.items
      }),
    }
  )
);