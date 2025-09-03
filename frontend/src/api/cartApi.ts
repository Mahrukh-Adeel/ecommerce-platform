import type { AddToCartRequest, Cart, UpdateCartItemRequest } from "../models/Cart";
import api from "./axios";
import { useAuthStore } from "../store/authStore";

const getUserId = () => {
    const { user } = useAuthStore.getState();
    return user?.id;
};

export const fetchCart = async (): Promise<Cart> => {
    const userId = getUserId();
    if (!userId) {
        return { 
            _id: '', 
            userId: '',
            items: [], 
            itemCount: 0, 
            total: 0 
        };
    }
    try {
        const response = await api.get(`/cart/${userId}`);
        if (response.data && response.data.success) {
            return response.data.data || { 
                _id: '', 
                userId: userId,
                items: [], 
                itemCount: 0, 
                total: 0 
            };
        }
        throw new Error(response.data.message || 'Failed to fetch cart');
    } catch (error) {
        console.error('Error fetching cart:', error);
        if (error instanceof Error && 'response' in error && (error as { response?: { status?: number } }).response?.status === 403) {
            console.log('🔒 403 error - likely user ID mismatch, returning empty cart');
        }
        return { 
            _id: '', 
            userId: userId || '',
            items: [], 
            itemCount: 0, 
            total: 0 
        };
    }
}

export const addToCart = async (data: AddToCartRequest): Promise<Cart> => {
    const response = await api.post('/cart', data);
    
    if (response.data && response.data.success && response.data.data) {
        return response.data.data;
    }
    return response.data;
}

export const updateCartItem = async (data: UpdateCartItemRequest): Promise<Cart> => {
    const userId = getUserId();
    
    if (!userId) {
        throw new Error('User not authenticated');
    }
    
    const response = await api.put(`/cart/${userId}/${data.productId}`, 
        { quantity: data.quantity }
    );
    
    if (response.data && response.data.success && response.data.data) {
        return response.data.data;
    }
    return response.data;
}

export const removeFromCart = async (productId: string): Promise<Cart> => {
    const userId = getUserId();
    
    if (!userId) {
        throw new Error('User not authenticated');
    }
    
    const response = await api.delete(`/cart/${userId}/${productId}`);
    
    if (response.data && response.data.success && response.data.data) {
        return response.data.data;
    }
    return response.data;
}

export const clearCart = async (): Promise<{ message: string }> => {
    const userId = getUserId();
    
    if (!userId) {
        throw new Error('User not authenticated');
    }
    
    const response = await api.delete(`/cart/${userId}`);
    
    if (response.data && response.data.success) {
        return response.data;
    }
    return response.data;
}