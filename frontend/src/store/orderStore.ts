import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createOrder, getUserOrders, getOrderById } from '../api/orderApi';
import type { Order, CreateOrderRequest } from '../models/Order';

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  
  createOrder: (orderData: CreateOrderRequest) => Promise<Order>;
  fetchUserOrders: (userId: string) => Promise<void>;
  fetchOrderById: (orderId: string) => Promise<void>;
  clearError: () => void;
  setCurrentOrder: (order: Order | null) => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      currentOrder: null,
      isLoading: false,
      error: null,

      createOrder: async (orderData: CreateOrderRequest) => {
        set({ isLoading: true, error: null });
        try {
          const order = await createOrder(orderData);
          set({ 
            currentOrder: order,
            orders: [order, ...get().orders],
            isLoading: false 
          });
          return order;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to create order';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      fetchUserOrders: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
          const orders = await getUserOrders(userId);
          set({ orders, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch orders';
          set({ error: errorMessage, isLoading: false });
        }
      },

      fetchOrderById: async (orderId: string) => {
        set({ isLoading: true, error: null });
        try {
          const order = await getOrderById(orderId);
          set({ currentOrder: order, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch order';
          set({ error: errorMessage, isLoading: false });
        }
      },

      clearError: () => set({ error: null }),
      
      setCurrentOrder: (order: Order | null) => set({ currentOrder: order }),
    }),
    {
      name: 'order-storage',
      partialize: (state) => ({ 
        orders: state.orders,
        currentOrder: state.currentOrder
      }),
    }
  )
);