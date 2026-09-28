import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'super_secret_jwt_cems_2026_dev_key',
    { expiresIn: '7d' }
  );
};

// @desc   Register a new user
// @route  POST /api/v1/auth/register
// @access Public
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role = 'student', studentId, department, year, phone } = req.body;

    if (!name || !email || !password || !department) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, password, and department.',
      });
    }

    // Prohibit direct registration of admin role through public endpoint
    const safeRole = role === 'admin' ? 'student' : role;

    // Check if email already registered
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists.',
      });
    }

    // Check if studentId already registered if student
    if (safeRole === 'student' && studentId) {
      const existingStudent = await User.findOne({ studentId });
      if (existingStudent) {
        return res.status(400).json({
          success: false,
          message: 'A student with this Student ID/Roll Number already exists.',
        });
      }
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: safeRole,
      studentId: safeRole === 'student' ? studentId : undefined,
      department,
      year: safeRole === 'student' ? (year || 1) : undefined,
      phone,
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Authenticate user and get token
// @route  POST /api/v1/auth/login
// @access Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. No account found with this email.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Password does not match.',
      });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Get current user profile
// @route  GET /api/v1/auth/me
// @access Private
export const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};
