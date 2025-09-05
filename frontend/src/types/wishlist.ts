import type { ProductData } from "../models/CategoriesData";

export interface WishlistItem {
  _id: string;
  userId: string;
  productId: ProductData;
  createdAt: string;
}

export interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
}

export interface AddToWishlistRequest {
  userId: string;
  productId: string;
}

export interface RemoveFromWishlistRequest {
  userId: string;
  productId: string;
}

export interface WishlistResponse {
  success: boolean;
  data?: WishlistItem[] | WishlistItem;
  message: string;
  error?: string;
}