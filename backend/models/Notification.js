import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['student_added', 'payment_collected', 'student_updated', 'student_deleted', 'student_restored'],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    actorName: {
      type: String,
      required: true
    },
    actorRole: {
      type: String,
      enum: ['admin', 'director'],
      required: true
    },
    recipientIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    relatedId: {
      type: mongoose.Schema.Types.ObjectId
    },
    relatedModel: {
      type: String,
      enum: ['Student', 'Payment']
    },
    readBy: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      readAt: {
        type: Date,
        default: Date.now
      }
    }],
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
notificationSchema.index({ recipientIds: 1, isActive: 1, createdAt: -1 });
notificationSchema.index({ actorId: 1, createdAt: -1 });

export default mongoose.model('Notification', notificationSchema);
