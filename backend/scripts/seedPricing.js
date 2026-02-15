import '../config/env.js';
import connectDB from '../config/database.js';
import Pricing from '../models/Pricing.js';

const pricingData = [
  // Regular Plans
  { studentType: 'regular', timePlan: '6hr', price: 250 },
  { studentType: 'regular', timePlan: '12hr', price: 450 },
  { studentType: 'regular', timePlan: '24hr', price: 800 },
  
  // Premium Plans
  { studentType: 'premium', timePlan: '6hr', price: 350 },
  { studentType: 'premium', timePlan: '12hr', price: 550 },
  { studentType: 'premium', timePlan: '24hr', price: 1000 }
];

const seedPricing = async () => {
  try {
    await connectDB();

    // Check if pricing already exists
    const existingCount = await Pricing.countDocuments();
    
    if (existingCount > 0) {
      console.log(`\n⚠️  ${existingCount} pricing plans already exist.`);
      console.log('Do you want to:');
      console.log('1. Keep existing prices');
      console.log('2. Update prices\n');
      
      // For now, just show existing prices
      const existing = await Pricing.find().sort({ studentType: 1, timePlan: 1 });
      console.log('\n📊 Existing Pricing:');
      console.log('==================');
      existing.forEach(p => {
        console.log(`${p.studentType.toUpperCase()} ${p.timePlan}: ₹${p.price}`);
      });
      
      process.exit(0);
      return;
    }

    // Insert pricing
    await Pricing.insertMany(pricingData);

    console.log('\n✅ Successfully seeded pricing!');
    console.log('\n📊 Pricing Plans Created:');
    console.log('=========================');
    console.log('\nRegular Plans (All 1 Month):');
    console.log('  6hr:  ₹250');
    console.log('  12hr: ₹450');
    console.log('  24hr: ₹800');
    console.log('\nPremium Plans (All 1 Month):');
    console.log('  6hr:  ₹350');
    console.log('  12hr: ₹550');
    console.log('  24hr: ₹1000');
    console.log('\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding pricing:', error);
    process.exit(1);
  }
};

seedPricing();
