import '../config/env.js';
import mongoose from 'mongoose';
import Seat from '../models/Seat.js';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/adarsh_vidyapeeth');
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
};

const seedSeats = async () => {
  try {
    await connectDB();

    // Check if seats already exist
    const existingSeats = await Seat.countDocuments();
    
    if (existingSeats > 0) {
      console.log(`\n⚠️  Found ${existingSeats} existing seats`);
      console.log('Do you want to delete and recreate? (Ctrl+C to cancel)');
      
      // Wait 3 seconds then proceed
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      await Seat.deleteMany({});
      console.log('🗑️  Deleted existing seats');
    }

    const seats = [];

    // Create 62 Regular seats (R1 to R62)
    for (let i = 1; i <= 62; i++) {
      seats.push({
        seatId: `R${i}`,
        seatType: 'regular',
        seatNumber: i,
        status: 'available',
        occupiedBy: null
      });
    }

    // Create 59 Premium seats (P1 to P59)
    for (let i = 1; i <= 59; i++) {
      seats.push({
        seatId: `P${i}`,
        seatType: 'premium',
        seatNumber: i,
        status: 'available',
        occupiedBy: null
      });
    }

    await Seat.insertMany(seats);

    const stats = {
      total: seats.length,
      regular: 62,
      premium: 59
    };

    console.log('\n✅ Successfully seeded seats!');
    console.log(`📊 Total: ${stats.total} seats`);
    console.log(`   Regular: ${stats.regular} seats (R1-R62)`);
    console.log(`   Premium: ${stats.premium} seats (P1-P59)`);
    console.log('\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding seats:', error);
    process.exit(1);
  }
};

seedSeats();
