import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Seat from '../models/Seat.js';
import Pricing from '../models/Pricing.js';
import User from '../models/User.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data (optional - comment out in production)
    // await Seat.deleteMany({});
    // await Pricing.deleteMany({});
    // await User.deleteMany({ role: 'admin' });

    // Seed Admin User
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        username: 'admin',
        password: 'admin123',
        mobile: '9999999999',
        role: 'admin',
        isActive: true
      });
      console.log('✅ Admin user created (username: admin, password: admin123)');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Seed Regular Seats (R1 - R80)
    const regularSeatsExist = await Seat.findOne({ seatId: 'R1' });
    if (!regularSeatsExist) {
      const regularSeats = [];
      for (let i = 1; i <= 80; i++) {
        regularSeats.push({
          seatId: `R${i}`,
          seatType: 'regular',
          seatNumber: i,
          status: 'available'
        });
      }
      await Seat.insertMany(regularSeats);
      console.log('✅ Created 80 Regular seats (R1 - R80)');
    } else {
      console.log('ℹ️  Regular seats already exist');
    }

    // Seed Premium Seats (P1 - P80)
    const premiumSeatsExist = await Seat.findOne({ seatId: 'P1' });
    if (!premiumSeatsExist) {
      const premiumSeats = [];
      for (let i = 1; i <= 80; i++) {
        premiumSeats.push({
          seatId: `P${i}`,
          seatType: 'premium',
          seatNumber: i,
          status: 'available'
        });
      }
      await Seat.insertMany(premiumSeats);
      console.log('✅ Created 80 Premium seats (P1 - P80)');
    } else {
      console.log('ℹ️  Premium seats already exist');
    }

    // Seed Pricing
    const pricingData = [
      { studentType: 'regular', timePlan: '6hr', price: 250 },
      { studentType: 'regular', timePlan: '12hr', price: 450 },
      { studentType: 'premium', timePlan: '6hr', price: 350 },
      { studentType: 'premium', timePlan: '12hr', price: 550 }
    ];

    for (const pricing of pricingData) {
      const exists = await Pricing.findOne({
        studentType: pricing.studentType,
        timePlan: pricing.timePlan
      });
      
      if (!exists) {
        await Pricing.create(pricing);
        console.log(`✅ Created pricing: ${pricing.studentType} - ${pricing.timePlan} - ₹${pricing.price}`);
      }
    }

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('\n⚠️  IMPORTANT: Change the admin password after first login!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
