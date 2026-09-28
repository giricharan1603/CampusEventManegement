import express from 'express';
import { Registration } from '../models/Registration.js';
import { Event } from '../models/Event.js';

const router = express.Router();

// 1. Register for an event
router.post('/', async (req, res) => {
  try {
    const { studentId, eventId } = req.body;

    if (!studentId || !eventId) {
      return res.status(400).json({ error: 'studentId and eventId are required.' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    // Check deadline
    if (new Date() > new Date(event.registrationDeadline)) {
      return res.status(400).json({ error: 'Registration deadline has passed.' });
    }

    // Check duplicate
    const existing = await Registration.findOne({ student: studentId, event: eventId });
    if (existing && existing.status === 'registered') {
      return res.status(400).json({ error: 'You are already registered for this event.' });
    }

    // Check capacity
    if (event.registeredCount >= event.capacity) {
      return res.status(400).json({ error: 'Event has reached full capacity.' });
    }

    let registration;
    if (existing) {
      existing.status = 'registered';
      existing.registeredAt = new Date();
      registration = await existing.save();
    } else {
      registration = await Registration.create({
        student: studentId,
        event: eventId,
        status: 'registered',
      });
    }

    // Increment registered count
    event.registeredCount += 1;
    await event.save();

    res.status(201).json({
      message: `Registration confirmed for "${event.title}"!`,
      registration,
      remainingSeats: event.capacity - event.registeredCount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Get registrations for a specific student
router.get('/student/:studentId', async (req, res) => {
  try {
    const registrations = await Registration.find({ student: req.params.studentId })
      .populate('event')
      .sort({ registeredAt: -1 });

    res.json(registrations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Cancel registration (release seat)
router.patch('/:id/cancel', async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id).populate('event');
    if (!registration) {
      return res.status(404).json({ error: 'Registration record not found.' });
    }

    if (registration.status === 'cancelled') {
      return res.status(400).json({ error: 'This registration is already cancelled.' });
    }

    registration.status = 'cancelled';
    await registration.save();

    // Decrement registeredCount on the event
    if (registration.event) {
      await Event.findByIdAndUpdate(registration.event._id, {
        $inc: { registeredCount: -1 },
      });
    }

    res.json({ message: 'Registration cancelled. Your seat has been released.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Get attendee roster for an event (Faculty / Admin)
router.get('/event/:eventId', async (req, res) => {
  try {
    const attendees = await Registration.find({ event: req.params.eventId, status: 'registered' })
      .populate('student', 'name email department studentId')
      .sort({ registeredAt: 1 });

    res.json(attendees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
