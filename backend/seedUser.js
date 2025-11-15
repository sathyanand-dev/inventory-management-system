require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user.model');

const seedUser = async () => {
  try {
    const uri = process.env.ATLAS_URI;
    await mongoose.connect(uri);
    console.log('MongoDB connected...');

    // Check if user already exists
    const existingUser = await User.findOne({ email: 'manager@inventory.com' });
    if (existingUser) {
      console.log('Default user already exists!');
      console.log('Email: manager@inventory.com');
      console.log('Password: manager123');
      process.exit(0);
    }

    // Create default user
    const user = await User.create({
      username: 'admin',
      email: 'manager@inventory.com',
      password: 'manager123',
      role: 'Inventory Manager',
    });

    console.log('✅ Default user created successfully!');
    console.log('Email: manager@inventory.com');
    console.log('Password: manager123');
    console.log('Role: Inventory Manager');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

seedUser();
