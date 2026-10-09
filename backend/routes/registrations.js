import express from 'express';
import { query, formatEvent, formatUser } from '../db.js';

const router = express.Router();

// 1. Register for an event
router.post('/', async (req, res) => {
  try {
    const { studentId, eventId } = req.body;

    if (!studentId || !eventId) {
      return res.status(400).json({ error: 'studentId and eventId are required.' });
    }

    const sId = parseInt(studentId, 10);
    const eId = parseInt(eventId, 10);

    const eventRes = await query('SELECT * FROM events WHERE id = $1', [eId]);
    if (eventRes.rowCount === 0) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    const event = eventRes.rows[0];

    // Check deadline
    if (new Date() > new Date(event.registration_deadline)) {
      return res.status(400).json({ error: 'Registration deadline has passed.' });
    }

    // Check duplicate
    const existingRes = await query(
      'SELECT * FROM registrations WHERE student_id = $1 AND event_id = $2',
      [sId, eId]
    );

    if (existingRes.rowCount > 0 && existingRes.rows[0].status === 'registered') {
      return res.status(400).json({ error: 'You are already registered for this event.' });
    }

    // Check capacity
    if (event.registered_count >= event.capacity) {
      return res.status(400).json({ error: 'Event has reached full capacity.' });
    }

    let regRow;
    if (existingRes.rowCount > 0) {
      const updateRes = await query(
        `UPDATE registrations 
         SET status = 'registered', registered_at = CURRENT_TIMESTAMP 
         WHERE id = $1 RETURNING *`,
        [existingRes.rows[0].id]
      );
      regRow = updateRes.rows[0];
    } else {
      const insertRes = await query(
        `INSERT INTO registrations (student_id, event_id, status)
         VALUES ($1, $2, 'registered') RETURNING *`,
        [sId, eId]
      );
      regRow = insertRes.rows[0];
    }

    // Increment registered_count on event
    const updatedEventRes = await query(
      `UPDATE events 
       SET registered_count = registered_count + 1 
       WHERE id = $1 RETURNING registered_count, capacity`,
      [eId]
    );

    const newCount = updatedEventRes.rows[0].registered_count;
    const capacity = updatedEventRes.rows[0].capacity;

    res.status(201).json({
      message: `Registration confirmed for "${event.title}"!`,
      registration: {
        _id: String(regRow.id),
        id: regRow.id,
        student: String(regRow.student_id),
        event: String(regRow.event_id),
        status: regRow.status,
        registeredAt: regRow.registered_at,
      },
      remainingSeats: capacity - newCount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Get registrations for a specific student
router.get('/student/:studentId', async (req, res) => {
  try {
    const sId = parseInt(req.params.studentId, 10);
    if (isNaN(sId)) {
      return res.status(400).json({ error: 'Invalid student ID.' });
    }

    const sql = `
      SELECT 
        r.id AS reg_id, r.status AS reg_status, r.registered_at AS reg_date,
        e.*,
        u.name AS coordinator_name, u.email AS coordinator_email, u.department AS coordinator_dept
      FROM registrations r
      JOIN events e ON r.event_id = e.id
      LEFT JOIN users u ON e.coordinator_id = u.id
      WHERE r.student_id = $1
      ORDER BY r.registered_at DESC
    `;

    const result = await query(sql, [sId]);
    const data = result.rows.map((row) => ({
      _id: String(row.reg_id),
      id: row.reg_id,
      status: row.reg_status,
      registeredAt: row.reg_date,
      event: formatEvent(row),
    }));

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Cancel registration (release seat)
router.patch('/:id/cancel', async (req, res) => {
  try {
    const regId = parseInt(req.params.id, 10);
    if (isNaN(regId)) {
      return res.status(400).json({ error: 'Invalid registration ID.' });
    }

    const regRes = await query('SELECT * FROM registrations WHERE id = $1', [regId]);
    if (regRes.rowCount === 0) {
      return res.status(404).json({ error: 'Registration record not found.' });
    }

    const reg = regRes.rows[0];
    if (reg.status === 'cancelled') {
      return res.status(400).json({ error: 'This registration is already cancelled.' });
    }

    await query("UPDATE registrations SET status = 'cancelled' WHERE id = $1", [regId]);

    // Decrement registered_count on the event
    await query(
      'UPDATE events SET registered_count = GREATEST(0, registered_count - 1) WHERE id = $1',
      [reg.event_id]
    );

    res.json({ message: 'Registration cancelled. Your seat has been released.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Get attendee roster for an event (Faculty / Admin)
router.get('/event/:eventId', async (req, res) => {
  try {
    const eId = parseInt(req.params.eventId, 10);
    if (isNaN(eId)) {
      return res.status(400).json({ error: 'Invalid event ID.' });
    }

    const sql = `
      SELECT 
        r.id AS reg_id, r.status AS reg_status, r.registered_at AS reg_date,
        u.*
      FROM registrations r
      JOIN users u ON r.student_id = u.id
      WHERE r.event_id = $1 AND r.status = 'registered'
      ORDER BY r.registered_at ASC
    `;

    const result = await query(sql, [eId]);
    const attendees = result.rows.map((row) => ({
      _id: String(row.reg_id),
      id: row.reg_id,
      status: row.reg_status,
      registeredAt: row.reg_date,
      student: formatUser(row),
    }));

    res.json(attendees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
