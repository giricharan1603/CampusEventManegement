import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
import registrationRoutes from './routes/registrations.js';
import { User } from './models/User.js';
import { Event } from './models/Event.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'CEMS Backend API' });
});

// Database Connection with Auto-Fallback
async function startDatabase() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cems_simple';
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
    console.log('[DB] Connected to MongoDB at', uri);
  } catch (err) {
    console.log('[DB] Local MongoDB not detected. Starting in-memory database fallback...');
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
    console.log('[DB] In-Memory MongoDB ready at', mongod.getUri());
  }

  // Auto-seed if database is brand new
  const count = await User.countDocuments();
  if (count === 0) {
    console.log('[DB] Database is empty. Seeding initial demo accounts and events...');
    await seedDemoData();
  }
}

async function seedDemoData() {
  const admin = await User.create({
    name: 'Campus Admin',
    email: 'admin@campus.edu',
    password: 'Password@123',
    role: 'admin',
    department: 'Administration',
  });

  const faculty = await User.create({
    name: 'Dr. Sarah Jenkins',
    email: 'faculty@campus.edu',
    password: 'Password@123',
    role: 'faculty',
    department: 'Computer Science',
  });

  const student = await User.create({
    name: 'Alex Johnson',
    email: 'student@campus.edu',
    password: 'Password@123',
    role: 'student',
    department: 'Computer Science',
    studentId: 'CS-2026-042',
  });

  const in14Days = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
  const in10Days = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
  const in7Days = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const in5Days = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);

  await Event.create({
    title: 'National Campus Hackathon 2026',
    description: 'A 24-hour sprint to build innovative software solutions with industry mentors.',
    category: 'technical',
    date: in14Days,
    time: '09:00 AM - 09:00 PM',
    venue: 'Innovation Center - Lab A',
    registrationDeadline: in10Days,
    capacity: 60,
    coordinator: faculty._id,
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=60',
  });

  await Event.create({
    title: 'Spring Harmony: Music & Dance Gala',
    description: 'The annual cultural festival with band showcases and dance competitions.',
    category: 'cultural',
    date: in7Days,
    time: '05:00 PM - 10:00 PM',
    venue: 'University Main Auditorium',
    registrationDeadline: in5Days,
    capacity: 150,
    coordinator: faculty._id,
    image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&auto=format&fit=crop&q=60',
  });

  await Event.create({
    title: 'Inter-College T20 Cricket Tournament',
    description: 'Knock-out tournament for campus cricket teams. Medals and trophies.',
    category: 'sports',
    date: in14Days,
    time: '08:00 AM - 05:00 PM',
    venue: 'Campus Sports Ground',
    registrationDeadline: in10Days,
    capacity: 40,
    coordinator: faculty._id,
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&auto=format&fit=crop&q=60',
  });

  console.log('[DB] Demo data seeded successfully!');
}

// Start Server
startDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`[CEMS Backend] Server running on http://localhost:${PORT}`);
  });
});
