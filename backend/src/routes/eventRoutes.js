import express from 'express';
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getMyCoordinatedEvents,
} from '../controllers/eventController.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getEvents);
router.get('/faculty/my-events', verifyToken, requireRole('faculty', 'admin'), getMyCoordinatedEvents);
router.get('/:id', getEventById);

// Protected routes (Faculty & Admin)
router.post('/', verifyToken, requireRole('faculty', 'admin'), createEvent);
router.put('/:id', verifyToken, requireRole('faculty', 'admin'), updateEvent);
router.delete('/:id', verifyToken, requireRole('faculty', 'admin'), deleteEvent);

export default router;
