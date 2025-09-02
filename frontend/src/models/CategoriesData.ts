export type CategoriesData = {
  _id: string; 
  name: string;
  description?: string; 
  count: number; 
  products: ProductData[];
};

export type ProductData = {
  _id: string; 
  name: string;
  description?: string;
  price: number;
  image: string;
  categoryId?: {
    _id: string;
    name: string;
    image: string;
  };
};