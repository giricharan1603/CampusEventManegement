import { Registration } from '../models/Registration.js';
import { Event } from '../models/Event.js';

// @desc   Register student for an event (atomic & concurrency-safe)
// @route  POST /api/v1/registrations/events/:eventId
// @access Private (Student only)
export const registerForEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const studentId = req.user._id;

    // MVP rule: Faculty coordinators cannot register as participants
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only registered students can participate in campus events.',
      });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
    }

    // 1. Check if event is active
    if (event.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Registration unavailable. This event has been cancelled by the coordinator.',
      });
    }

    // 2. Check registration deadline
    if (new Date() > new Date(event.registrationDeadline)) {
      return res.status(400).json({
        success: false,
        message: 'Registration closed. The registration deadline for this event has passed.',
      });
    }

    // 3. Check for existing registration
    const existingReg = await Registration.findOne({
      student: studentId,
      event: eventId,
    });

    if (existingReg && existingReg.status === 'registered') {
      return res.status(400).json({
        success: false,
        message: 'You are already actively registered for this event.',
      });
    }

    // 4. Atomic capacity check and seat decrement
    const updatedEvent = await Event.findOneAndUpdate(
      {
        _id: eventId,
        registrationDeadline: { $gt: new Date() },
        status: { $in: ['open', 'upcoming'] },
        $expr: { $lt: ['$registeredCount', '$capacity'] },
      },
      {
        $inc: { registeredCount: 1 },
      },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(400).json({
        success: false,
        message: 'Registration failed. The event has reached full capacity or the deadline just passed.',
      });
    }

    // If capacity is now full, update event status to 'full'
    if (updatedEvent.registeredCount >= updatedEvent.capacity) {
      await Event.findByIdAndUpdate(eventId, { status: 'full' });
    }

    // 5. Create or re-activate registration record
    let registration;
    if (existingReg) {
      existingReg.status = 'registered';
      existingReg.registeredAt = new Date();
      registration = await existingReg.save();
    } else {
      registration = await Registration.create({
        student: studentId,
        event: eventId,
        status: 'registered',
      });
    }

    res.status(201).json({
      success: true,
      message: `Registration successful! You have reserved a seat for "${event.title}".`,
      registration,
      remainingSeats: updatedEvent.capacity - updatedEvent.registeredCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Get registered events for logged-in student
// @route  GET /api/v1/registrations/my
// @access Private (Student only)
export const getMyRegistrations = async (req, res, next) => {
  try {
    const registrations = await Registration.find({ student: req.user._id })
      .populate({
        path: 'event',
        populate: {
          path: 'coordinator',
          select: 'name email department phone',
        },
      })
      .sort({ registeredAt: -1 });

    res.status(200).json({
      success: true,
      count: registrations.length,
      registrations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Cancel event registration and release seat
// @route  PATCH /api/v1/registrations/:id/cancel
// @access Private (Student only)
export const cancelRegistration = async (req, res, next) => {
  try {
    const registration = await Registration.findOne({
      _id: req.params.id,
      student: req.user._id,
    }).populate('event');

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration record not found or does not belong to your account.',
      });
    }

    if (registration.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This registration has already been cancelled.',
      });
    }

    const event = registration.event;

    // Verify deadline for cancellation
    if (new Date() > new Date(event.registrationDeadline)) {
      return res.status(400).json({
        success: false,
        message: 'Cancellation window closed. You cannot cancel after the event registration deadline.',
      });
    }

    // Flip status
    registration.status = 'cancelled';
    await registration.save();

    // Atomically release the seat
    const updatedEvent = await Event.findByIdAndUpdate(
      event._id,
      {
        $inc: { registeredCount: -1 },
        ...(event.status === 'full' ? { status: 'open' } : {}),
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: `Your registration for "${event.title}" has been cancelled. Seat released.`,
      registration,
      remainingSeats: updatedEvent.capacity - updatedEvent.registeredCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Get registered students for an event (roster)
// @route  GET /api/v1/registrations/events/:eventId/attendees
// @access Private (Faculty coordinator of event or Admin)
export const getEventAttendees = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
    }

    // Role check: Faculty can only inspect their own event roster; Admin can inspect all
    if (req.user.role !== 'admin' && event.coordinator.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. You can only view attendee rosters for events you coordinate.',
      });
    }

    const attendees = await Registration.find({ event: eventId, status: 'registered' })
      .populate('student', 'name email studentId department year phone')
      .sort({ registeredAt: 1 });

    res.status(200).json({
      success: true,
      eventTitle: event.title,
      eventCategory: event.category,
      eventDate: event.date,
      venue: event.venue,
      capacity: event.capacity,
      registeredCount: attendees.length,
      attendees,
    });
  } catch (error) {
    next(error);
  }
};
