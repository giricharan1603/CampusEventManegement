import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
import registrationRoutes from './routes/registrations.js';
import { initDb } from './db.js';

dotenv.config();

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
  res.json({ status: 'ok', service: 'CEMS Backend API (PostgreSQL)' });
});

// Start Server after Database Initialization
async function startServer() {
  try {
    await initDb();
    app.listen(PORT, () => {
      console.log(`[CEMS Backend] Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('[CEMS Backend] Failed to start database:', err.message);
    process.exit(1);
  }
}

startServer();
