export interface OrderItem {
  productId: {
    _id: string;
    name: string;
    price: number;
    images?: string[];
  };
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface Order {
  _id?: string;
  userId: string;
  products: OrderItem[];
  total: number;
  status: "placed" | "processing" | "shipped" | "delivered" | "cancelled";
  address: string; // Backend stores this as a string
  paymentMethod: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateOrderRequest {
  products: {
    productId: string;
    quantity: number;
  }[];
  address: string;
  paymentMethod: string;
}