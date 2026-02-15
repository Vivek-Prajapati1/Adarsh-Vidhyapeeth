import User from '../models/User.js';
import { createAuditLog } from '../utils/auditLogger.js';

// @desc    Get all directors
// @route   GET /api/directors
// @access  Private/Admin
export const getAllDirectors = async (req, res) => {
  try {
    const directors = await User.find({ role: 'director' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: directors.length,
      data: directors
    });
  } catch (error) {
    console.error('Get directors error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create new director
// @route   POST /api/directors
// @access  Private/Admin
export const createDirector = async (req, res) => {
  try {
    const { name, username, password, mobile } = req.body;

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Username already exists'
      });
    }

    // Create director
    const director = await User.create({
      name,
      username,
      password,
      mobile,
      role: 'director',
      isActive: true,
      createdBy: req.user.id
    });

    // Create audit log
    await createAuditLog({
      action: 'director_created',
      performedBy: req.user.id,
      performedByName: req.user.name,
      performedByRole: req.user.role,
      targetModel: 'User',
      targetId: director._id,
      newValues: {
        name: director.name,
        username: director.username,
        mobile: director.mobile
      },
      ipAddress: req.ip
    });

    res.status(201).json({
      success: true,
      message: 'Director created successfully',
      data: {
        id: director._id,
        name: director.name,
        username: director.username,
        mobile: director.mobile,
        isActive: director.isActive
      }
    });
  } catch (error) {
    console.error('Create director error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Update director
// @route   PUT /api/directors/:id
// @access  Private/Admin
export const updateDirector = async (req, res) => {
  try {
    const { name, username, password, mobile, isActive } = req.body;

    const director = await User.findById(req.params.id).select('+password');

    if (!director || director.role !== 'director') {
      return res.status(404).json({
        success: false,
        message: 'Director not found'
      });
    }

    // Check if username is being changed and already exists
    if (username && username !== director.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username already exists'
        });
      }
    }

    const oldValues = {
      name: director.name,
      username: director.username,
      mobile: director.mobile,
      isActive: director.isActive
    };

    // Update fields
    if (name) director.name = name;
    if (username) director.username = username;
    if (mobile !== undefined) director.mobile = mobile;
    if (isActive !== undefined) director.isActive = isActive;
    if (password) director.password = password; // Will be hashed by pre-save hook

    await director.save();

    // Create audit log
    await createAuditLog({
      action: 'director_updated',
      performedBy: req.user.id,
      performedByName: req.user.name,
      performedByRole: req.user.role,
      targetModel: 'User',
      targetId: director._id,
      oldValues,
      newValues: {
        name: director.name,
        username: director.username,
        mobile: director.mobile,
        isActive: director.isActive
      },
      ipAddress: req.ip
    });

    res.status(200).json({
      success: true,
      message: 'Director updated successfully',
      data: {
        id: director._id,
        name: director.name,
        username: director.username,
        mobile: director.mobile,
        isActive: director.isActive
      }
    });
  } catch (error) {
    console.error('Update director error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Toggle director status (activate/deactivate)
// @route   PUT /api/directors/:id/toggle-status
// @access  Private/Admin
export const toggleDirectorStatus = async (req, res) => {
  try {
    const director = await User.findById(req.params.id);

    if (!director || director.role !== 'director') {
      return res.status(404).json({
        success: false,
        message: 'Director not found'
      });
    }

    const oldStatus = director.isActive;
    director.isActive = !director.isActive;
    await director.save();

    // Create audit log
    await createAuditLog({
      action: director.isActive ? 'director_activated' : 'director_deactivated',
      performedBy: req.user.id,
      performedByName: req.user.name,
      performedByRole: req.user.role,
      targetModel: 'User',
      targetId: director._id,
      oldValues: { isActive: oldStatus },
      newValues: { isActive: director.isActive },
      ipAddress: req.ip
    });

    res.status(200).json({
      success: true,
      message: `Director ${director.isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        id: director._id,
        name: director.name,
        isActive: director.isActive
      }
    });
  } catch (error) {
    console.error('Toggle director status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get director by ID
// @route   GET /api/directors/:id
// @access  Private/Admin
export const getDirectorById = async (req, res) => {
  try {
    const director = await User.findById(req.params.id)
      .select('-password')
      .populate('createdBy', 'name username');

    if (!director || director.role !== 'director') {
      return res.status(404).json({
        success: false,
        message: 'Director not found'
      });
    }

    res.status(200).json({
      success: true,
      data: director
    });
  } catch (error) {
    console.error('Get director error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
