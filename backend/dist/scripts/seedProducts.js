import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import Product from '../src/models/Product.js';
import Category from '../src/models/Category.js';
dotenv.config();
const productsByCategory = {
    'Living Room': [
        {
            name: 'Modern Sofa Set',
            description: 'Comfortable 3-piece modern sofa set with premium fabric upholstery',
            price: 1299.99,
            image: '/products/living-room/sofa-set.jpg'
        },
        {
            name: 'Coffee Table',
            description: 'Elegant glass-top coffee table with wooden legs',
            price: 299.99,
            image: '/products/living-room/coffee-table.jpg'
        },
        {
            name: 'Floor Lamp',
            description: 'Contemporary floor lamp with adjustable brightness',
            price: 149.99,
            image: '/products/living-room/floor-lamp.jpg'
        },
        {
            name: 'TV Stand',
            description: 'Modern TV stand with storage compartments',
            price: 399.99,
            image: '/products/living-room/tv-stand.jpg'
        }
    ],
    'Bedroom': [
        {
            name: 'Queen Bed Frame',
            description: 'Solid wood queen bed frame with upholstered headboard',
            price: 799.99,
            image: '/products/bedroom/queen-bed.jpg'
        },
        {
            name: 'Nightstand Set',
            description: 'Matching pair of bedside nightstands with drawers',
            price: 249.99,
            image: '/products/bedroom/nightstand.jpg'
        },
        {
            name: 'Dresser',
            description: '6-drawer dresser with mirror',
            price: 549.99,
            image: '/products/bedroom/dresser.jpg'
        },
        {
            name: 'Table Lamp',
            description: 'Bedside table lamp with fabric shade',
            price: 79.99,
            image: '/products/bedroom/table-lamp.jpg'
        }
    ],
    'Dining Room': [
        {
            name: 'Dining Table Set',
            description: '6-seater dining table with matching chairs',
            price: 899.99,
            image: '/products/dining-room/dining-set.jpg'
        },
        {
            name: 'Dining Chairs',
            description: 'Set of 4 upholstered dining chairs',
            price: 299.99,
            image: '/products/dining-room/dining-chairs.jpg'
        },
        {
            name: 'Buffet Cabinet',
            description: 'Storage buffet cabinet for dining room',
            price: 649.99,
            image: '/products/dining-room/buffet.jpg'
        },
        {
            name: 'Chandelier',
            description: 'Crystal chandelier for dining room',
            price: 449.99,
            image: '/products/dining-room/chandelier.jpg'
        }
    ],
    'Office': [
        {
            name: 'Office Desk',
            description: 'L-shaped office desk with built-in storage',
            price: 499.99,
            image: '/products/office/office-desk.jpg'
        },
        {
            name: 'Office Chair',
            description: 'Ergonomic office chair with lumbar support',
            price: 299.99,
            image: '/products/office/office-chair.jpg'
        },
        {
            name: 'Bookshelf',
            description: '5-tier wooden bookshelf',
            price: 199.99,
            image: '/products/office/bookshelf.jpg'
        },
        {
            name: 'Desk Lamp',
            description: 'LED desk lamp with USB charging port',
            price: 89.99,
            image: '/products/office/desk-lamp.jpg'
        }
    ],
    'Storage': [
        {
            name: 'Storage Cabinet',
            description: 'Multi-purpose storage cabinet with doors',
            price: 349.99,
            image: '/products/storage/storage-cabinet.jpg'
        },
        {
            name: 'Storage Bins',
            description: 'Set of 6 fabric storage bins',
            price: 59.99,
            image: '/products/storage/storage-bins.jpg'
        },
        {
            name: 'Shoe Rack',
            description: '3-tier wooden shoe rack',
            price: 79.99,
            image: '/products/storage/shoe-rack.jpg'
        },
        {
            name: 'Storage Ottoman',
            description: 'Upholstered ottoman with hidden storage',
            price: 129.99,
            image: '/products/storage/storage-ottoman.jpg'
        }
    ],
    'Outdoor': [
        {
            name: 'Patio Set',
            description: '4-piece outdoor patio furniture set',
            price: 699.99,
            image: '/products/outdoor/patio-set.jpg'
        },
        {
            name: 'Garden Chair',
            description: 'Weather-resistant outdoor chairs',
            price: 149.99,
            image: '/products/outdoor/garden-chair.jpg'
        },
        {
            name: 'Outdoor Table',
            description: 'Teak wood outdoor dining table',
            price: 399.99,
            image: '/products/outdoor/outdoor-table.jpg'
        },
        {
            name: 'Umbrella',
            description: 'Large patio umbrella with UV protection',
            price: 179.99,
            image: '/products/outdoor/umbrella.jpg'
        }
    ]
};
async function seed() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        console.log('Clearing existing products...');
        await Product.deleteMany({});
        console.log('Fetching categories...');
        const categories = await Category.find({});
        if (categories.length === 0) {
            console.log('No categories found. Please run seedCategories first.');
            await mongoose.disconnect();
            return;
        }
        console.log('Creating products for each category...');
        for (const category of categories) {
            const categoryProducts = productsByCategory[category.name];
            if (categoryProducts) {
                console.log(`Adding products for category: ${category.name}`);
                const productsToInsert = categoryProducts.map(product => ({
                    ...product,
                    categoryId: category._id
                }));
                await Product.insertMany(productsToInsert);
                console.log(`Added ${productsToInsert.length} products for ${category.name}`);
            }
        }
        console.log('Products seeded successfully!');
        const totalProducts = await Product.countDocuments();
        console.log(`Total products in database: ${totalProducts}`);
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
    catch (error) {
        console.error('Error seeding products:', error);
        process.exit(1);
    }
}
seed();
//# sourceMappingURL=seedProducts.js.map