import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['technical', 'cultural', 'sports', 'academic'],
      required: true,
      lowercase: true,
    },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    venue: { type: String, required: true },
    registrationDeadline: { type: Date, required: true },
    capacity: { type: Number, required: true, min: 1 },
    registeredCount: { type: Number, default: 0 },
    coordinator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60',
    },
  },
  { timestamps: true }
);

export const Event = mongoose.model('Event', eventSchema);
