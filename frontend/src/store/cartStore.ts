import { create } from "zustand";
import { persist } from "zustand/middleware";
import { fetchCart, addToCart, updateCartItem, removeFromCart, clearCart } from "../api/cartApi";
import type { CartState } from "../types/cart";

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      isLoading: false,
      error: null,

      getCart: async () => {
        set({ isLoading: true, error: null });
        try {
          const cart = await fetchCart();
          set({ cart, isLoading: false });
        } catch (error) {
          console.error('Failed to fetch cart:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch cart',
            isLoading: false 
          });
        }
      },

      addItemToCart: async (productId: string, quantity: number = 1) => {
        set({ isLoading: true, error: null });
        try {
          const cart = await addToCart({ productId, quantity });
          set({ cart, isLoading: false });
        } catch (error) {
          console.error('Failed to add item to cart:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to add item to cart',
            isLoading: false 
          });
          throw error;
        }
      },

      updateItemQuantity: async (productId: string, quantity: number) => {
        set({ isLoading: true, error: null });
        try {
          const cart = await updateCartItem({ productId, quantity });
          set({ cart, isLoading: false });
        } catch (error) {
          console.error('Failed to update cart item:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update cart item',
            isLoading: false 
          });
        }
      },

      removeItemFromCart: async (productId: string) => {
        set({ isLoading: true, error: null });
        try {
          const cart = await removeFromCart(productId);
          set({ cart, isLoading: false });
        } catch (error) {
          console.error('Failed to remove cart item:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to remove cart item',
            isLoading: false 
          });
        }
      },

      clearCartItems: async () => {
        set({ isLoading: true, error: null });
        try {
          await clearCart();
          set({ cart: null, isLoading: false });
        } catch (error) {
          console.error('Failed to clear cart:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to clear cart',
            isLoading: false 
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },

      getTotalItems: () => {
        const { cart } = get();
        return cart?.itemCount || 0;
      },

      getTotalPrice: () => {
        const { cart } = get();
        return cart?.total || 0;
      },

      getCartItem: (productId: string) => {
        const { cart } = get();
        return cart?.items.find(item => item.productId._id === productId);
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({
        cart: state.cart,
      }),
    }
  )
);