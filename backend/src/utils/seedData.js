import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Event } from '../models/Event.js';
import { Registration } from '../models/Registration.js';

dotenv.config();

export const seedDatabase = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await connectDB();
    }

    console.log('[Seed] Clearing existing database collections...');
    await Registration.deleteMany({});
    await Event.deleteMany({});
    await User.deleteMany({});

    console.log('[Seed] Creating demo users...');
    // Create Admin
    const admin = await User.create({
      name: 'Campus System Admin',
      email: 'admin@campus.edu',
      password: 'Password@123',
      role: 'admin',
      department: 'Central Administration',
      phone: '+1-555-0100',
    });

    // Create Faculty Coordinators
    const faculty1 = await User.create({
      name: 'Dr. Sarah Jenkins',
      email: 'faculty@campus.edu',
      password: 'Password@123',
      role: 'faculty',
      department: 'Computer Science',
      phone: '+1-555-0199',
    });

    const faculty2 = await User.create({
      name: 'Prof. Marcus Vance',
      email: 'marcus@campus.edu',
      password: 'Password@123',
      role: 'faculty',
      department: 'Physical Education & Arts',
      phone: '+1-555-0188',
    });

    // Create Students
    const student1 = await User.create({
      name: 'Alex Johnson',
      email: 'student@campus.edu',
      password: 'Password@123',
      role: 'student',
      studentId: 'CS2026-042',
      department: 'Computer Science',
      year: 3,
      phone: '+1-555-0144',
    });

    const student2 = await User.create({
      name: 'Priya Sharma',
      email: 'priya@campus.edu',
      password: 'Password@123',
      role: 'student',
      studentId: 'EC2026-118',
      department: 'Electronics & Communication',
      year: 2,
      phone: '+1-555-0155',
    });

    console.log('[Seed] Creating sample events...');
    const now = new Date();

    const hackathonDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    const hackathonDeadline = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);

    const galaDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const galaDeadline = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);

    const cricketDate = new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000);
    const cricketDeadline = new Date(now.getTime() + 18 * 24 * 60 * 60 * 1000);

    const aiSymposiumDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const aiSymposiumDeadline = new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000);

    const event1 = await Event.create({
      title: 'National Campus Hackathon 2026',
      description: 'A 24-hour sprint to build innovative AI and Web solutions for campus and societal challenges. Mentors from top tech firms will be present.',
      category: 'technical',
      date: hackathonDate,
      startTime: '09:00 AM',
      endTime: '09:00 AM (Next Day)',
      venue: 'Innovation Center - Lab A & B',
      registrationDeadline: hackathonDeadline,
      capacity: 80,
      registeredCount: 1,
      eligibility: 'Open to all Engineering & Science students',
      rules: 'Teams of 1-4 members. Bring your own laptops. Hardware kits provided.',
      coordinator: faculty1._id,
      coordinatorContact: faculty1.phone,
      status: 'open',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=60',
    });

    const event2 = await Event.create({
      title: 'Spring Harmony: Music & Dance Gala',
      description: 'The annual inter-departmental cultural festival showcasing solo singing, band performances, and classical/contemporary dance acts.',
      category: 'cultural',
      date: galaDate,
      startTime: '05:00 PM',
      endTime: '10:00 PM',
      venue: 'Main University Amphitheater',
      registrationDeadline: galaDeadline,
      capacity: 200,
      registeredCount: 1,
      eligibility: 'Open to all students, faculty, and alumni',
      rules: 'Props must be registered with the stage manager 24 hours prior to performance.',
      coordinator: faculty2._id,
      coordinatorContact: faculty2.phone,
      status: 'open',
      image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&auto=format&fit=crop&q=60',
    });

    const event3 = await Event.create({
      title: 'Inter-College T20 Cricket Tournament',
      description: 'Annual knock-out cricket cup between all academic departments. Medals and trophies for top bowler, batsman, and player of the tournament.',
      category: 'sports',
      date: cricketDate,
      startTime: '08:00 AM',
      endTime: '06:00 PM',
      venue: 'North Campus Sports Grounds',
      registrationDeadline: cricketDeadline,
      capacity: 45,
      registeredCount: 0,
      eligibility: 'Valid student ID required at toss',
      rules: 'Standard ICC T20 guidelines apply. White uniforms mandatory.',
      coordinator: faculty2._id,
      coordinatorContact: faculty2.phone,
      status: 'open',
      image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&auto=format&fit=crop&q=60',
    });

    const event4 = await Event.create({
      title: 'Symposium on Generative AI & Autonomous Agents',
      description: 'Keynotes from prominent AI researchers discussing LLM reasoning, multimodal robotics, and ethics in automated systems.',
      category: 'academic',
      date: aiSymposiumDate,
      startTime: '10:00 AM',
      endTime: '03:30 PM',
      venue: 'Auditorium Hall 2',
      registrationDeadline: aiSymposiumDeadline,
      capacity: 120,
      registeredCount: 0,
      eligibility: 'All students and faculty researchers',
      rules: 'Pre-registration mandatory for conference kit and lunch coupon.',
      coordinator: faculty1._id,
      coordinatorContact: faculty1.phone,
      status: 'open',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=60',
    });

    console.log('[Seed] Creating demo registrations...');
    await Registration.create({
      student: student1._id,
      event: event1._id,
      status: 'registered',
      registeredAt: new Date(),
    });

    await Registration.create({
      student: student1._id,
      event: event2._id,
      status: 'registered',
      registeredAt: new Date(),
    });

    console.log('[Seed] Database populated successfully!');
    console.log('----------------------------------------------------');
    console.log('DEMO ACCOUNTS:');
    console.log('Admin:   admin@campus.edu   / Password@123');
    console.log('Faculty: faculty@campus.edu / Password@123');
    console.log('Student: student@campus.edu / Password@123');
    console.log('----------------------------------------------------');
  } catch (error) {
    console.error('[Seed] Error seeding database:', error.message);
  }
};

// If run directly
if (process.argv[1]?.endsWith('seedData.js')) {
  seedDatabase().then(() => {
    mongoose.connection.close();
    process.exit(0);
  });
}
