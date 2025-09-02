import api from "./axios";

export const fetchProductsByCategory = async (categoryId: string) => {
    const response = await api.get(`/products?category=${categoryId}`);
    
    if (response.data && response.data.success && response.data.data) {
        return response.data.data; 
    }
    
    return response.data;
}

export const fetchProducts = async () => {
    const response = await api.get("/products");
    
    if (response.data && response.data.success && response.data.data) {
        return response.data.data;
    }
    
    return response.data;
}

export const fetchProductById = async (productId: string) => {
    try {
        const response = await api.get(`/products/${productId}`);
        
        if (response.data && response.data.success && response.data.data) {
            return response.data.data;
        } else if (response.data) {
            return response.data;
        } else {
            throw new Error('Invalid response format from server');
        }
    } catch (error) {
        console.error('Error in fetchProductById:', error);
        throw error;
    }
}