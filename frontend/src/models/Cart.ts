export interface CartItem {
    _id: string;
    productId: {
        _id: string;
        name: string;
        price: number;
        images: string[];
        stock: number;
    };
    quantity: number;
}

export interface Cart {
    _id: string;
    userId: string;
    items: CartItem[];
    total: number;
    itemCount: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface AddToCartRequest {
    productId: string;
    quantity: number;
}

export interface UpdateCartItemRequest {
    productId: string;
    quantity: number;
}