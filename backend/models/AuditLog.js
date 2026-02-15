import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: [
      'student_added',
      'student_edited',
      'student_deleted',
      'student_restored',
      'seat_assigned',
      'seat_changed',
      'payment_added',
      'payment_reversed',
      'director_created',
      'director_activated',
      'director_deactivated',
      'pricing_changed',
      'admin_login',
      'director_login'
    ]
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  performedByName: {
    type: String,
    required: true
  },
  performedByRole: {
    type: String,
    enum: ['admin', 'director'],
    required: true
  },
  targetModel: {
    type: String,
    enum: ['Student', 'Payment', 'User', 'Pricing', 'Seat'],
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  oldValues: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  newValues: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  reason: {
    type: String,
    default: null
  },
  ipAddress: {
    type: String,
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now,
    immutable: true
  }
}, {
  timestamps: false
});

// Indexes for faster queries
auditLogSchema.index({ performedBy: 1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ timestamp: -1 });
auditLogSchema.index({ targetModel: 1, targetId: 1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;
