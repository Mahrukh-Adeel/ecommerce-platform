import { create } from 'zustand';
import { getAllOrders, updateOrderStatus, createProduct, updateProduct, deleteProduct } from '../api/adminApi';
import { fetchProducts } from '../api/productApi';
import type { AdminState } from '../types/adminState';
import { getProductErrorMessage, getOrderErrorMessage } from '../utils/errorUtils';

export const useAdminStore = create<AdminState>((set, get) => ({
    orders: [],
    isLoadingOrders: false,
    ordersError: null,
    products: [],
    isLoadingProducts: false,
    productsError: null,
    successMessage: null,

    fetchAllOrders: async () => {
        set({ isLoadingOrders: true, ordersError: null });
        try {
            const orders = await getAllOrders();
            set({ orders, isLoadingOrders: false });
        } catch (error) {
            const errorMessage = getOrderErrorMessage(error);
            set({ ordersError: errorMessage, isLoadingOrders: false });
        }
    },

    updateOrderStatus: async (orderId: string, status: string) => {
        set({ ordersError: null, successMessage: null });
        try {
            const updatedOrder = await updateOrderStatus(orderId, status);
            const orders = get().orders.map(order => 
                order._id === orderId ? updatedOrder : order
            );
            set({ orders, successMessage: 'Order status updated successfully!' });
            
            setTimeout(() => {
                const currentState = get();
                if (currentState.successMessage === 'Order status updated successfully!') {
                    set({ successMessage: null });
                }
            }, 5000);
        } catch (error) {
            const errorMessage = getOrderErrorMessage(error);
            set({ ordersError: errorMessage, successMessage: null });
        }
    },

    fetchAllProducts: async () => {
        set({ isLoadingProducts: true, productsError: null });
        try {
            const products = await fetchProducts();
            set({ products: Array.isArray(products) ? products : [], isLoadingProducts: false });
        } catch (error) {
            const errorMessage = getProductErrorMessage(error);
            set({ productsError: errorMessage, isLoadingProducts: false });
        }
    },

    createProduct: async (productData) => {
        set({ isLoadingProducts: true, productsError: null, successMessage: null });
        try {
            const newProduct = await createProduct(productData);
            const products = [...get().products, newProduct];
            set({ products, isLoadingProducts: false, successMessage: 'Product created successfully!' });
            
            setTimeout(() => {
                const currentState = get();
                if (currentState.successMessage === 'Product created successfully!') {
                    set({ successMessage: null });
                }
            }, 5000);
        } catch (error) {
            const errorMessage = getProductErrorMessage(error);
            set({ productsError: errorMessage, isLoadingProducts: false, successMessage: null });
        }
    },

    updateProduct: async (productId: string, productData) => {
        set({ isLoadingProducts: true, productsError: null, successMessage: null });
        try {
            const updatedProduct = await updateProduct(productId, productData);
            const products = get().products.map(product =>
                product._id === productId ? updatedProduct : product
            );
            set({ 
                products, 
                isLoadingProducts: false,
                successMessage: 'Product updated successfully!', 
                productsError: null 
            });
            
            setTimeout(() => {
                const currentState = get();
                if (currentState.successMessage === 'Product updated successfully!') {
                    set({ successMessage: null });
                }
            }, 5000);
        } catch (error) {
            const errorMessage = getProductErrorMessage(error);
            set({ 
                isLoadingProducts: false,
                productsError: errorMessage, 
                successMessage: null 
            });
        }
    },


    deleteProduct: async (productId: string) => {
        set({ isLoadingProducts: true, productsError: null, successMessage: null });
        try {
            await deleteProduct(productId);
            const products = get().products.filter(product => product._id !== productId);
            set({ 
                products, 
                isLoadingProducts: false,
                successMessage: 'Product deleted successfully!',
                productsError: null
            });
            
            setTimeout(() => {
                const currentState = get();
                if (currentState.successMessage === 'Product deleted successfully!') {
                    set({ successMessage: null });
                }
            }, 5000);
        } catch (error) {
            const errorMessage = getProductErrorMessage(error);
            set({ 
                isLoadingProducts: false,
                productsError: errorMessage, 
                successMessage: null 
            });
        }
    },

    clearErrors: () => set({ ordersError: null, productsError: null }),
    clearSuccess: () => set({ successMessage: null }),
}));