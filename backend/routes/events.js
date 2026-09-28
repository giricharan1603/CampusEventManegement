import express from 'express';
import { Event } from '../models/Event.js';
import { Registration } from '../models/Registration.js';

const router = express.Router();

// 1. Get all events (with optional search and category filter)
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};

    if (category && category !== 'all') {
      filter.category = category.toLowerCase();
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { venue: { $regex: search, $options: 'i' } },
      ];
    }

    const events = await Event.find(filter)
      .populate('coordinator', 'name email department')
      .sort({ date: 1 });

    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Get single event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('coordinator', 'name email department');
    if (!event) return res.status(404).json({ error: 'Event not found.' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Create a new event (Faculty / Admin)
router.post('/', async (req, res) => {
  try {
    const { title, description, category, date, time, venue, registrationDeadline, capacity, coordinatorId, image } = req.body;

    if (!title || !description || !category || !date || !time || !venue || !registrationDeadline || !capacity || !coordinatorId) {
      return res.status(400).json({ error: 'Please fill in all mandatory event fields.' });
    }

    const event = await Event.create({
      title,
      description,
      category: category.toLowerCase(),
      date,
      time,
      venue,
      registrationDeadline,
      capacity: Number(capacity),
      coordinator: coordinatorId,
      image: image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60',
    });

    res.status(201).json({ message: 'Event published successfully!', event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Delete an event
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found.' });

    // Clean up any registrations for this event
    await Registration.deleteMany({ event: event._id });
    await event.deleteOne();

    res.json({ message: 'Event and associated registrations deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
