import express from 'express';
import { User } from '../models/User.js';

const router = express.Router();

// 1. User Registration
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'student', department, studentId } = req.body;

    if (!name || !email || !password || !department) {
      return res.status(400).json({ error: 'Name, email, password, and department are required.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role,
      department,
      studentId: role === 'student' ? studentId : '',
    });

    const userObj = user.toObject();
    delete userObj.password;

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

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'No user found with this email address.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect password.' });
    }

    const userObj = user.toObject();
    delete userObj.password;

    res.json({ message: `Welcome back, ${user.name}!`, user: userObj });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Get All Users (for Admin)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Update User Role (for Admin)
router.patch('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    res.json({ message: `User role changed to ${role}`, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
