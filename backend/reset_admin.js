import './config/env.js';
import mongoose from 'mongoose';
import User from './models/User.js';

const reset = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  
  // Delete ALL old admin users
  const deleted1 = await User.deleteMany({ role: 'admin' });
  console.log('Deleted all old admin users:', deleted1.deletedCount, 'records');
  
  // Create new admin user from .env
  const newUser = await User.create({
    name: 'Admin',
    username: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD,
    mobile: '1234567890',
    role: 'admin',
    isActive: true
  });
  console.log('✅ New admin user created successfully');
  console.log('Email:', newUser.username);
  console.log('Password: (from .env ADMIN_PASSWORD)');
  
  process.exit(0);
};

reset().catch(e => {
  console.error('❌ Error:', e.message);
  process.exit(1);
});
