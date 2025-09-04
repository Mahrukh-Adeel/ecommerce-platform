import api from "./axios";
import type { Order } from "../models/Order";
import type { ProductData } from '../models/ProductData'

export const getAllOrders = async (): Promise<Order[]> => {
    const response = await api.get("/orders");

    if (response.data && response.data.success) {
        return response.data.data;
    }

    throw new Error(response.data?.message || 'Failed to fetch orders');
}

export const updateOrderStatus = async (orderId: string, status: string): Promise<Order> => {
  const response = await api.put(`/orders/${orderId}/status`, { status });
  
  if (response.data && response.data.success) {
    return response.data.data;
  }
  
  throw new Error(response.data?.message || 'Failed to update order status');
};

export const createProduct = async (productData: {
    name: string;
    description: string;
    price: number;
    image: string;
    categoryId: string;
}): Promise<ProductData> => {
    const response = await api.post("/products", productData);
    if (response.data && response.data.success) {
        return response.data.data;
    }
  
    throw new Error(response.data?.message || 'Failed to create product');
}

export const updateProduct = async (productId: string, productData: {
    name?: string;
    description?: string;
    price?: number;
    image?: string;
    categoryId?: string;
}): Promise<ProductData> => {
    const response = await api.put(`/products/${productId}`, productData);
    if (response.data && response.data.success) {
        return response.data.data;
    }
  
    throw new Error(response.data?.message || 'Failed to update product');
}

export const deleteProduct = async(productId: string): Promise<void> =>{
    const response = await api.delete(`/products/${productId}`);
    if (!response.data?.success) {
        throw new Error(response.data?.message || 'Failed to delete product');
    }
}