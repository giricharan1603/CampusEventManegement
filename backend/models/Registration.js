import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    status: {
      type: String,
      enum: ['registered', 'cancelled'],
      default: 'registered',
    },
    registeredAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Compound index ensures a student cannot register twice for the same event
registrationSchema.index({ student: 1, event: 1 }, { unique: true });

export const Registration = mongoose.model('Registration', registrationSchema);
