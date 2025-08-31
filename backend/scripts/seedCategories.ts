import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Category from '../src/models/Category.js';

dotenv.config();

const categories = [
  { name: 'Living Room', image: '/home/living.jpg' },
  { name: 'Bedroom', image: '/home/bedroom.jpg' },
  { name: 'Dining Room', image: '/home/dining.jpg' },
  { name: 'Office', image: '/home/office.jpg' },
  { name: 'Storage', image: '/home/storage.jpg' },
  { name: 'Outdoor', image: '/home/outdoor.jpg' }
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('Connected to MongoDB');
    
    console.log('Clearing existing categories...');
    await Category.deleteMany({});
    
    console.log('Inserting new categories...');
    await Category.insertMany(categories);
    
    console.log('Categories seeded successfully!');
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
}

seed();