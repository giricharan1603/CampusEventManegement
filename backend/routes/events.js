import express from 'express';
import { query, formatEvent } from '../db.js';

const router = express.Router();

const EVENT_SELECT_SQL = `
  SELECT 
    e.*,
    u.name AS coordinator_name,
    u.email AS coordinator_email,
    u.department AS coordinator_dept
  FROM events e
  LEFT JOIN users u ON e.coordinator_id = u.id
`;

// 1. Get all events (with optional search and category filter)
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    const conditions = [];
    const params = [];

    if (category && category !== 'all') {
      params.push(category.toLowerCase());
      conditions.push(`LOWER(e.category) = $${params.length}`);
    }

    if (search && search.trim() !== '') {
      params.push(`%${search.trim()}%`);
      conditions.push(`(e.title ILIKE $${params.length} OR e.description ILIKE $${params.length} OR e.venue ILIKE $${params.length})`);
    }

    let sql = EVENT_SELECT_SQL;
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    sql += ' ORDER BY e.date ASC';

    const result = await query(sql, params);
    res.json(result.rows.map(formatEvent));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Get single event by ID
router.get('/:id', async (req, res) => {
  try {
    const eventId = parseInt(req.params.id, 10);
    if (isNaN(eventId)) {
      return res.status(400).json({ error: 'Invalid event ID.' });
    }

    const sql = `${EVENT_SELECT_SQL} WHERE e.id = $1`;
    const result = await query(sql, [eventId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    res.json(formatEvent(result.rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Create a new event (Faculty / Admin)
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      date,
      time,
      venue,
      registrationDeadline,
      capacity,
      coordinatorId,
      image,
    } = req.body;

    if (!title || !description || !category || !date || !time || !venue || !registrationDeadline || !capacity || !coordinatorId) {
      return res.status(400).json({ error: 'Please fill in all mandatory event fields.' });
    }

    const insertSql = `
      INSERT INTO events (title, description, category, date, time, venue, registration_deadline, capacity, coordinator_id, image)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const defaultImg = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60';
    const result = await query(insertSql, [
      title,
      description,
      category.toLowerCase(),
      date,
      time,
      venue,
      registrationDeadline,
      parseInt(capacity, 10),
      parseInt(coordinatorId, 10),
      image || defaultImg,
    ]);

    // Fetch newly created event with coordinator info
    const fullRes = await query(`${EVENT_SELECT_SQL} WHERE e.id = $1`, [result.rows[0].id]);
    res.status(201).json({
      message: 'Event published successfully!',
      event: formatEvent(fullRes.rows[0]),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Delete an event
router.delete('/:id', async (req, res) => {
  try {
    const eventId = parseInt(req.params.id, 10);
    if (isNaN(eventId)) {
      return res.status(400).json({ error: 'Invalid event ID.' });
    }

    // CASCADE delete deletes registrations automatically, but explicit delete ensures clarity
    await query('DELETE FROM registrations WHERE event_id = $1', [eventId]);
    const result = await query('DELETE FROM events WHERE id = $1 RETURNING *', [eventId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    res.json({ message: 'Event and associated registrations deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
