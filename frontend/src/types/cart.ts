import type { Cart, CartItem } from '../models/Cart';

export type CartState = {
    cart: Cart | null;
    isLoading: boolean;
    error: string | null;

    getCart: () => Promise<void>;
    addItemToCart: (productId: string, quantity?: number) => Promise<void>;
    updateItemQuantity: (productId: string, quantity: number) => Promise<void>;
    removeItemFromCart: (productId: string) => Promise<void>;
    clearCartItems: () => Promise<void>;
    clearError: () => void;

    getTotalItems: () => number;
    getTotalPrice: () => number;
    getCartItem: (productId: string) => CartItem | undefined;
};