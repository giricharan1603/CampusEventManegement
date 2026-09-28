import { User } from '../models/User.js';
import { Event } from '../models/Event.js';
import { Registration } from '../models/Registration.js';

// @desc   Get system stats & KPIs
// @route  GET /api/v1/admin/stats
// @access Private (Admin only)
export const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalFaculty = await User.countDocuments({ role: 'faculty' });
    const totalEvents = await Event.countDocuments();
    const activeEvents = await Event.countDocuments({ status: { $in: ['open', 'upcoming'] } });
    const totalRegistrations = await Registration.countDocuments({ status: 'registered' });

    // Category breakdown
    const categoryStats = await Event.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, totalSeats: { $sum: '$capacity' } } },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalStudents,
        totalFaculty,
        totalEvents,
        activeEvents,
        totalRegistrations,
        categoryStats,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Get all users
// @route  GET /api/v1/admin/users
// @access Private (Admin only)
export const getAllUsers = async (req, res, next) => {
  try {
    const { role, search } = req.query;
    const filter = {};

    if (role && role !== 'all') {
      filter.role = role;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Update user role
// @route  PATCH /api/v1/admin/users/:id/role
// @access Private (Admin only)
export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['student', 'faculty', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified. Must be student, faculty, or admin.',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: `User role updated to '${role}'.`,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Delete user
// @route  DELETE /api/v1/admin/users/:id
// @access Private (Admin only)
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Clean up dependent registrations
    await Registration.deleteMany({ student: user._id });

    // If faculty, mark events as cancelled
    if (user.role === 'faculty') {
      await Event.updateMany({ coordinator: user._id }, { status: 'cancelled' });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User and associated records removed successfully.',
    });
  } catch (error) {
    next(error);
  }
};
