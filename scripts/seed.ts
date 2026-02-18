import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Product from '../lib/models/Product';
import User from '../lib/models/User';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bean-haven';

const products = [
  {
    name: "Classic Flight",
    description: "Our signature blend with notes of chocolate and caramel",
    price: 3.99,
    image: "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    category: "hot",
    featured: true,
  },
  {
    name: "Double Shot Espresso",
    description: "Double shot of our premium espresso",
    price: 3.49,
    image: "https://images.pexels.com/photos/11699084/pexels-photo-11699084.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    category: "hot",
    featured: true,
  },
  {
    name: "Cloud Nine Cappuccino",
    description: "Velvety foam with our signature espresso",
    price: 4.49,
    image: "https://images.pexels.com/photos/350478/pexels-photo-350478.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    category: "hot",
  },
  {
    name: "Iced Soaring Latte",
    description: "Chilled espresso with milk and your choice of flavor",
    price: 4.99,
    image: "https://images.pexels.com/photos/2638019/pexels-photo-2638019.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    category: "cold",
    featured: true,
  },
  {
    name: "Altitude Cold Brew",
    description: "Smooth, 24-hour steeped cold brew coffee",
    price: 4.79,
    image: "https://images.pexels.com/photos/2615323/pexels-photo-2615323.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    category: "cold",
  },
  {
    name: "Airfoil Croissant",
    description: "Buttery, flaky croissant baked fresh daily",
    price: 3.29,
    image: "https://images.pexels.com/photos/3892469/pexels-photo-3892469.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    category: "food",
  },
  {
    name: "Navigator's Breakfast Wrap",
    description: "Egg, cheese, and your choice of protein",
    price: 6.99,
    image: "https://images.pexels.com/photos/19752024/pexels-photo-19752024/free-photo-of-bagel-with-salmon.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    category: "food",
  },
  {
    name: "High-Flyer Cookie",
    description: "Chocolate chip cookie with a hint of sea salt",
    price: 2.49,
    image: "https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    category: "food",
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');

    // Create products
    const createdProducts = await Product.insertMany(products);
    console.log(`Created ${createdProducts.length} products`);

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    await User.create({
      name: 'Admin User',
      email: 'admin@beanhavencafe.com',
      password: hashedPassword,
      role: 'admin',
    });
    console.log('Created admin user: admin@beanhavencafe.com / admin123');

    // Create test user
    const hashedUserPassword = await bcrypt.hash('user123', 12);
    await User.create({
      name: 'Test User',
      email: 'user@beanhavencafe.com',
      password: hashedUserPassword,
      role: 'user',
    });
    console.log('Created test user: user@beanhavencafe.com / user123');

    console.log('\\n✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
