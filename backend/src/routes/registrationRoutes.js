import express from 'express';
import {
  registerForEvent,
  getMyRegistrations,
  cancelRegistration,
  getEventAttendees,
} from '../controllers/registrationController.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Student-only routes
router.post('/events/:eventId', verifyToken, requireRole('student'), registerForEvent);
router.get('/my', verifyToken, requireRole('student'), getMyRegistrations);
router.patch('/:id/cancel', verifyToken, requireRole('student'), cancelRegistration);

// Faculty & Admin roster route
router.get('/events/:eventId/attendees', verifyToken, requireRole('faculty', 'admin'), getEventAttendees);

export default router;
