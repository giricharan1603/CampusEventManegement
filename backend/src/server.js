import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Load environment variables
dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health Check API
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date(),
    service: 'Campus Event Management System API',
    version: '1.0.0',
  });
});

// Mount versioned REST API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/registrations', registrationRoutes);
app.use('/api/v1/admin', adminRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  try {
    await connectDB();

    // Check if database needs seeding
    const { User } = await import('./models/User.js');
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[CEMS Backend] Empty database detected. Auto-seeding initial demo data...');
      const { seedDatabase } = await import('./utils/seedData.js');
      await seedDatabase();
    }

    app.listen(PORT, () => {
      console.log(`[CEMS Backend] Server running on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
      console.log(`[CEMS Backend] API Health: http://localhost:${PORT}/api/v1/health`);
    });
  } catch (error) {
    console.error(`[CEMS Backend] Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
