import api from "./axios";
import type { Order, CreateOrderRequest } from '../models/Order';

export const createOrder = async (orderData: CreateOrderRequest): Promise<Order> => {
  const response = await api.post('/orders', orderData);
  
  if (response.data && response.data.success) {
    return response.data.data;
  }
  
  throw new Error(response.data?.message || 'Failed to create order');
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  const response = await api.get(`/orders/user/${userId}`);
  
  if (response.data && response.data.success) {
    return response.data.data;
  }
  
  return [];
};

export const getOrderById = async (orderId: string): Promise<Order> => {
  const response = await api.get(`/orders/${orderId}`);
  
  if (response.data && response.data.success) {
    return response.data.data;
  }
  
  throw new Error('Order not found');
};