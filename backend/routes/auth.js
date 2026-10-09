import express from 'express';
import bcrypt from 'bcryptjs';
import { query, formatUser } from '../db.js';

const router = express.Router();

// 1. User Registration
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'student', department, studentId } = req.body;

    if (!name || !email || !password || !department) {
      return res.status(400).json({ error: 'Name, email, password, and department are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existingRes = await query('SELECT id FROM users WHERE email = $1', [cleanEmail]);
    if (existingRes.rowCount > 0) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await query(
      `INSERT INTO users (name, email, password, role, department, student_id)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, cleanEmail, hashedPassword, role, department, role === 'student' ? studentId : '']
    );

    const userObj = formatUser(result.rows[0]);
    res.status(201).json({ message: 'Registration successful!', user: userObj });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. User Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Please enter both email and password.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const result = await query('SELECT * FROM users WHERE email = $1', [cleanEmail]);
    if (result.rowCount === 0) {
      return res.status(401).json({ error: 'No user found with this email address.' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect password.' });
    }

    res.json({ message: `Welcome back, ${user.name}!`, user: formatUser(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Get All Users (for Admin)
router.get('/users', async (req, res) => {
  try {
    const result = await query('SELECT * FROM users ORDER BY created_at DESC');
    res.json(result.rows.map(formatUser));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Update User Role (for Admin)
router.patch('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    const result = await query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING *',
      [role, req.params.id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json({ message: `User role changed to ${role}`, user: formatUser(result.rows[0]) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
