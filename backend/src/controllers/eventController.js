import { Event } from '../models/Event.js';
import { Registration } from '../models/Registration.js';

// @desc   Get all events (with filter & search)
// @route  GET /api/v1/events
// @access Public
export const getEvents = async (req, res, next) => {
  try {
    const { category, search, status, upcoming } = req.query;
    const filter = {};

    if (category && category !== 'all') {
      filter.category = category.toLowerCase();
    }

    if (status && status !== 'all') {
      filter.status = status.toLowerCase();
    }

    if (upcoming === 'true') {
      filter.date = { $gte: new Date() };
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { venue: { $regex: search, $options: 'i' } },
      ];
    }

    const events = await Event.find(filter)
      .populate('coordinator', 'name email department phone')
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Get single event by ID
// @route  GET /api/v1/events/:id
// @access Public
export const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('coordinator', 'name email department phone');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found with the specified ID.',
      });
    }

    res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Create new event
// @route  POST /api/v1/events
// @access Private (Faculty / Admin)
export const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      date,
      startTime,
      endTime,
      venue,
      registrationDeadline,
      capacity,
      eligibility,
      rules,
      coordinatorContact,
      image,
    } = req.body;

    if (!title || !description || !category || !date || !startTime || !endTime || !venue || !registrationDeadline || !capacity) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all mandatory event fields.',
      });
    }

    const eventDate = new Date(date);
    const deadline = new Date(registrationDeadline);

    if (deadline > eventDate) {
      return res.status(400).json({
        success: false,
        message: 'Registration deadline cannot be after the event start date.',
      });
    }

    const event = await Event.create({
      title,
      description,
      category: category.toLowerCase(),
      date: eventDate,
      startTime,
      endTime,
      venue,
      registrationDeadline: deadline,
      capacity: Number(capacity),
      eligibility,
      rules,
      coordinator: req.user._id,
      coordinatorContact: coordinatorContact || req.user.phone,
      image: image || `https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60`,
      status: 'open',
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully.',
      event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Update event
// @route  PUT /api/v1/events/:id
// @access Private (Faculty / Admin)
export const updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
    }

    // Role verification: Faculty can only edit their own events; Admin can edit any
    if (req.user.role !== 'admin' && event.coordinator.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. You can only update events created by yourself.',
      });
    }

    if (req.body.capacity && Number(req.body.capacity) < event.registeredCount) {
      return res.status(400).json({
        success: false,
        message: `Capacity cannot be lower than the current registered participants count (${event.registeredCount}).`,
      });
    }

    if (req.body.registrationDeadline && req.body.date) {
      if (new Date(req.body.registrationDeadline) > new Date(req.body.date)) {
        return res.status(400).json({
          success: false,
          message: 'Registration deadline cannot be after the event start date.',
        });
      }
    }

    // Update fields
    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('coordinator', 'name email department');

    res.status(200).json({
      success: true,
      message: 'Event updated successfully.',
      event: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Delete/Cancel event
// @route  DELETE /api/v1/events/:id
// @access Private (Faculty / Admin)
export const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
    }

    // Role check: Faculty can only delete their own events; Admin can delete any
    if (req.user.role !== 'admin' && event.coordinator.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. You can only delete events created by yourself.',
      });
    }

    // Soft delete/Cancel event to preserve audit registrations or hard delete if no registrations
    const regCount = await Registration.countDocuments({ event: event._id });
    if (regCount > 0) {
      event.status = 'cancelled';
      await event.save();
      return res.status(200).json({
        success: true,
        message: `Event status updated to 'cancelled'. ${regCount} existing registration records were preserved.`,
        event,
      });
    } else {
      await event.deleteOne();
      return res.status(200).json({
        success: true,
        message: 'Event deleted successfully.',
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc   Get events coordinated by logged-in faculty
// @route  GET /api/v1/events/faculty/my-events
// @access Private (Faculty / Admin)
export const getMyCoordinatedEvents = async (req, res, next) => {
  try {
    const query = req.user.role === 'admin' ? {} : { coordinator: req.user._id };
    const events = await Event.find(query).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    next(error);
  }
};
