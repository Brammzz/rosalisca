import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const defaultAdmin = {
  email: 'admin@gmail.com',
  password: 'admin123',
  role: 'admin'
};

const seedAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: defaultAdmin.email });

    if (existingAdmin) {
      console.log('Admin user already exists');
      console.log('Email:', defaultAdmin.email);
      console.log('Password:', defaultAdmin.password);
      console.log('Role:', defaultAdmin.role);
    } else {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(defaultAdmin.password, salt);

      // Create admin user
      const adminUser = new User({
        email: defaultAdmin.email,
        password: hashedPassword,
        role: defaultAdmin.role
      });

      await adminUser.save();
      console.log('✅ Admin user created successfully!');
      console.log('📧 Email:', defaultAdmin.email);
      console.log('🔑 Password:', defaultAdmin.password);
      console.log('👤 Role:', defaultAdmin.role);
      console.log('');
      console.log('🚀 You can now login to the admin dashboard!');
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
};

// Run the seeder
seedAdminUser();
