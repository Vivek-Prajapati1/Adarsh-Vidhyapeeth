import '../config/env.js';
import mongoose from 'mongoose';
import Pricing from '../models/Pricing.js';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/adarsh_vidyapeeth');
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
};

const updatePricing = async () => {
  try {
    await connectDB();

    // Delete existing pricing
    await Pricing.deleteMany({});
    console.log('🗑️  Deleted existing pricing');

    // Create new pricing structure
    const pricingData = [
      {
        studentType: 'regular',
        timePlan: '12hr',
        price: 450,
        isActive: true
      },
      {
        studentType: 'regular',
        timePlan: '6hr',
        price: 250,
        isActive: true
      },
      {
        studentType: 'premium',
        timePlan: '12hr',
        price: 550,
        isActive: true
      },
      {
        studentType: 'premium',
        timePlan: '6hr',
        price: 350,
        isActive: true
      }
    ];

    await Pricing.insertMany(pricingData);

    console.log('\n✅ Successfully updated pricing!');
    console.log('\n📊 New Pricing Structure:');
    console.log('   Regular 12hr (9 AM - 9 PM): ₹450/month');
    console.log('   Regular 6hr (9 AM - 3 PM or 3 PM - 9 PM): ₹250/month');
    console.log('   Premium 12hr (9 AM - 9 PM): ₹550/month');
    console.log('   Premium 6hr (9 AM - 3 PM or 3 PM - 9 PM): ₹350/month');
    console.log('\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating pricing:', error);
    process.exit(1);
  }
};

updatePricing();
