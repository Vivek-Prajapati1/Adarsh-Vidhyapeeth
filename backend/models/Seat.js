import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema({
  seatId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  seatType: {
    type: String,
    enum: ['regular', 'premium'],
    required: true
  },
  seatNumber: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'occupied'],
    default: 'available'
  },
  occupiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    default: null
  },
  lastOccupiedAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Seat = mongoose.model('Seat', seatSchema);

export default Seat;
