import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number']
  },
  photo: {
    type: String,
    default: null
  },
  studentType: {
    type: String,
    enum: ['regular', 'premium'],
    required: [true, 'Student type is required']
  },
  timePlan: {
    type: String,
    enum: ['6hr', '12hr', '24hr'],
    required: [true, 'Time plan is required']
  },
  seatNumber: {
    type: String,
    required: [true, 'Seat number is required'],
    uppercase: true
  },
  joinDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  expiryDate: {
    type: Date,
    required: true
  },
  totalFee: {
    type: Number,
    required: true,
    min: 0
  },
  feePaid: {
    type: Number,
    default: 0,
    min: 0
  },
  feeDue: {
    type: Number,
    default: 0,
    min: 0
  },
  feeStatus: {
    type: String,
    enum: ['paid', 'partial', 'due', 'overpaid'],
    default: 'due'
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'deleted'],
    default: 'active'
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date,
    default: null
  },
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  deletedReason: {
    type: String,
    default: null
  },
  restoredAt: {
    type: Date,
    default: null
  },
  restoredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
studentSchema.index({ mobile: 1 });
studentSchema.index({ status: 1 });
studentSchema.index({ isDeleted: 1 });
studentSchema.index({ addedBy: 1 });

const Student = mongoose.model('Student', studentSchema);

export default Student;
