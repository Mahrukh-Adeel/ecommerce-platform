export interface ProductData {
  _id: string;
  name: string;
  price: number;
  image: string;
  images?: string[];
  description?: string;
  categoryId?: string | {
    _id: string;
    name: string;
    image: string;
  };
  stock?: number;
  inStock?: boolean;
  createdAt?: string;
  updatedAt?: string;
}