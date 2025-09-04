import { create } from 'zustand';
import { getAllOrders, updateOrderStatus, createProduct, updateProduct, deleteProduct } from '../api/adminApi';
import { fetchProducts } from '../api/productApi';
import type { AdminState } from '../types/adminState';

export const useAdminStore = create<AdminState>((set, get) => ({
    orders: [],
    isLoadingOrders: false,
    ordersError: null,
    products: [],
    isLoadingProducts: false,
    productsError: null,

    fetchAllOrders: async () => {
        set({ isLoadingOrders: true, ordersError: null });
        try {
            const orders = await getAllOrders();
            set({ orders, isLoadingOrders: false });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch orders';
            set({ ordersError: errorMessage, isLoadingOrders: false });
        }
    },

    updateOrderStatus: async (orderId: string, status: string) => {
        try {
            const updatedOrder = await updateOrderStatus(orderId, status);
            const orders = get().orders.map(order => 
                order._id === orderId ? updatedOrder : order
            );
            set({ orders });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to update order status';
            set({ ordersError: errorMessage });
        }
    },

    fetchAllProducts: async () => {
        set({ isLoadingProducts: true, productsError: null });
        try {
            const products = await fetchProducts();
            set({ products: Array.isArray(products) ? products : [], isLoadingProducts: false });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch products';
            set({ productsError: errorMessage, isLoadingProducts: false });
        }
    },

    createProduct: async (productData) => {
        set({ isLoadingProducts: true, productsError: null });
        try {
            const newProduct = await createProduct(productData);
            const products = [...get().products, newProduct];
            set({ products, isLoadingProducts: false });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to create product';
            set({ productsError: errorMessage, isLoadingProducts: false });
        }
    },

    updateProduct: async (productId: string, productData) => {
        try {
            const updatedProduct = await updateProduct(productId, productData);
            const products = get().products.map(product => 
                product._id === productId ? updatedProduct : product
            );
            set({ products });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to update product';
            set({ productsError: errorMessage });
        }
    },

    deleteProduct: async (productId: string) => {
        try {
            await deleteProduct(productId);
            const products = get().products.filter(product => product._id !== productId);
            set({ products });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete product';
            set({ productsError: errorMessage });
        }
    },

    clearErrors: () => set({ ordersError: null, productsError: null }),
}));