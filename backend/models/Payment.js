import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: 1
  },
  paymentMode: {
    type: String,
    enum: ['cash', 'upi', 'card', 'bank_transfer'],
    required: [true, 'Payment mode is required']
  },
  receiptNumber: {
    type: String,
    required: [true, 'Receipt number is required'],
    trim: true
  },
  receiptImage: {
    type: String,
    required: [true, 'Receipt image is required']
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  },
  isReversed: {
    type: Boolean,
    default: false
  },
  reversedAt: {
    type: Date,
    default: null
  },
  reversedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  reversedReason: {
    type: String,
    default: null
  },
  collectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collectionDate: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  }
}, {
  timestamps: false
});

// Indexes for analytics
paymentSchema.index({ student: 1 });
paymentSchema.index({ collectedBy: 1 });
paymentSchema.index({ collectionDate: 1 });
paymentSchema.index({ isReversed: 1 });

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
