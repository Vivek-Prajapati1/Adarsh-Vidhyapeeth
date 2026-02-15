import '../config/env.js';
import connectDB from '../config/database.js';
import Seat from '../models/Seat.js';

const checkSeats = async () => {
  try {
    await connectDB();
    
    const totalSeats = await Seat.countDocuments();
    const regularSeats = await Seat.countDocuments({ seatType: 'regular' });
    const premiumSeats = await Seat.countDocuments({ seatType: 'premium' });
    const availableSeats = await Seat.countDocuments({ status: 'available' });
    
    console.log('\n📊 Seat Statistics:');
    console.log('===================');
    console.log(`Total Seats: ${totalSeats}`);
    console.log(`Regular Seats: ${regularSeats}`);
    console.log(`Premium Seats: ${premiumSeats}`);
    console.log(`Available Seats: ${availableSeats}`);
    
    if (totalSeats === 0) {
      console.log('\n⚠️  No seats found! Run seedSeats.js to create seats.');
    } else {
      console.log('\n✅ Seats are properly seeded!');
      
      // Show sample seats
      const sampleRegular = await Seat.findOne({ seatType: 'regular' }).limit(1);
      const samplePremium = await Seat.findOne({ seatType: 'premium' }).limit(1);
      
      console.log('\n📋 Sample Seats:');
      if (sampleRegular) {
        console.log(`Regular: ${sampleRegular.seatId} - ${sampleRegular.status}`);
      }
      if (samplePremium) {
        console.log(`Premium: ${samplePremium.seatId} - ${samplePremium.status}`);
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkSeats();
