import type { Order } from '../models/Order';
import type { ProductData } from '../models/ProductData';

export interface AdminState {
    orders: Order[];
    isLoadingOrders: boolean;
    ordersError: string | null;

    products: ProductData[];
    isLoadingProducts: boolean;
    productsError: string | null;
    successMessage: string | null;

    fetchAllOrders: () => Promise<void>;
    updateOrderStatus: (orderId: string, status: string) => Promise<void>;
    fetchAllProducts: () => Promise<void>;
    createProduct: (productData: {
        name: string;
        description: string;
        price: number;
        image: string;
        categoryId: string;
    }) => Promise<void>;
    updateProduct: (productId: string, productData: {
        name?: string;
        description?: string;
        price?: number;
        image?: string;
        categoryId?: string;
    }) => Promise<void>;
    deleteProduct: (productId: string) => Promise<void>;
    clearErrors: () => void;
    clearSuccess: () => void;
}