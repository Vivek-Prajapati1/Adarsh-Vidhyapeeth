import mongoose from 'mongoose';

const pricingSchema = new mongoose.Schema({
  studentType: {
    type: String,
    enum: ['regular', 'premium'],
    required: true
  },
  timePlan: {
    type: String,
    enum: ['6hr', '12hr', '24hr'],
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index to ensure unique pricing per type and plan
pricingSchema.index({ studentType: 1, timePlan: 1 }, { unique: true });

const Pricing = mongoose.model('Pricing', pricingSchema);

export default Pricing;
