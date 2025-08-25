import type { CategoriesData, ProductData } from "../models/CategoriesData";

const categoriesData: CategoriesData[] = [
    {
        id: 'living-room',
        name: 'Living Room',
        description: 'Comfortable and stylish furniture for your living space',
        color: 'primary.main',
        count: '12+ items',
        products: [
            { id: 1, name: 'Modern Sectional Sofa', price: 1299, originalPrice: 1599, image: '/api/placeholder/300/300', sale: true, rating: 4.5 },
            { id: 2, name: 'Glass Coffee Table', price: 399, image: '/api/placeholder/300/300', rating: 4.2 },
            { id: 3, name: 'Leather Recliner', price: 899, image: '/api/placeholder/300/300', rating: 4.8 },
            { id: 4, name: 'TV Stand Cabinet', price: 299, originalPrice: 399, image: '/api/placeholder/300/300', sale: true, rating: 4.0 }
        ] as ProductData[]
    },
    {
        id: 'bedroom',
        name: 'Bedroom',
        description: 'Create your perfect sanctuary with our bedroom collection',
        color: 'secondary.main',
        count: '8+ items',
        products: [
            { id: 5, name: 'King Size Bed Frame', price: 799, image: '/api/placeholder/300/300', rating: 4.6 },
            { id: 6, name: 'Wooden Nightstand', price: 199, image: '/api/placeholder/300/300', rating: 4.3 },
            { id: 7, name: '6-Drawer Dresser', price: 599, originalPrice: 749, image: '/api/placeholder/300/300', sale: true, rating: 4.4 },
            { id: 8, name: 'Upholstered Bench', price: 249, image: '/api/placeholder/300/300', rating: 4.1 }
        ] as ProductData[]
    },
    {
        id: 'dining-room',
        name: 'Dining Room',
        description: 'Elegant dining sets for memorable meals',
        color: '#D97706',
        count: '6+ items',
        products: [
            { id: 9, name: 'Oak Dining Table', price: 899, originalPrice: 1199, image: '/api/placeholder/300/300', sale: true, rating: 4.7 },
            { id: 10, name: 'Dining Chairs Set of 4', price: 399, image: '/api/placeholder/300/300', rating: 4.5 },
            { id: 11, name: 'Kitchen Bar Stools', price: 159, image: '/api/placeholder/300/300', rating: 4.2 },
            { id: 12, name: 'Buffet Cabinet', price: 699, image: '/api/placeholder/300/300', rating: 4.3 }
        ] as ProductData[]
    },
    {
        id: 'office',
        name: 'Office',
        description: 'Productive and comfortable workspace solutions',
        color: '#546a76',
        count: '4+ items',
        products: [
            { id: 13, name: 'Executive Desk', price: 599, image: '/api/placeholder/300/300', rating: 4.4 },
            { id: 14, name: 'Ergonomic Office Chair', price: 349, originalPrice: 449, image: '/api/placeholder/300/300', sale: true, rating: 4.6 },
            { id: 15, name: 'Bookshelf Unit', price: 299, image: '/api/placeholder/300/300', rating: 4.3 },
            { id: 16, name: 'Filing Cabinet', price: 199, image: '/api/placeholder/300/300', rating: 4.0 }
        ] as ProductData[]
    },
    {
        id: 'storage',
        name: 'Storage',
        description: 'Smart storage solutions for every room',
        color: '#8A522D',
        count: '9+ items',
        products: [
            { id: 17, name: 'Multi-Shelf Bookcase', price: 249, image: '/api/placeholder/300/300', rating: 4.3 },
            { id: 18, name: 'Storage Ottoman', price: 129, image: '/api/placeholder/300/300', rating: 4.1 },
            { id: 19, name: 'Wardrobe Closet', price: 599, originalPrice: 749, image: '/api/placeholder/300/300', sale: true, rating: 4.5 },
            { id: 20, name: 'Storage Chest', price: 199, image: '/api/placeholder/300/300', rating: 4.2 }
        ] as ProductData[]
    },
    {
        id: 'outdoor',
        name: 'Outdoor',
        description: 'Weather-resistant furniture for your outdoor spaces',
        color: '#10B981',
        count: '3+ items',
        products: [
            { id: 21, name: 'Patio Dining Set', price: 799, image: '/api/placeholder/300/300', rating: 4.4 },
            { id: 22, name: 'Garden Bench', price: 299, image: '/api/placeholder/300/300', rating: 4.2 },
            { id: 23, name: 'Outdoor Lounge Chair', price: 399, originalPrice: 499, image: '/api/placeholder/300/300', sale: true, rating: 4.6 }
        ] as ProductData[]
    }
];

  export default categoriesData;