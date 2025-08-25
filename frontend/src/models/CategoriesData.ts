export type CategoriesData ={
    id: string;
    name: string;
    description: string;
    color: string;
    count: string;
    products: ProductData[];
}

export type ProductData = {
    id: number;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    sale?: boolean;
    rating: number;
}