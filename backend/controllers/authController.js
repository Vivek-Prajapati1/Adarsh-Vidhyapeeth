import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { createAuditLog } from '../utils/auditLogger.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username and password'
      });
    }

    // Check for user (include password field)
    const user = await User.findOne({ username }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact admin.'
      });
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Create audit log
    await createAuditLog({
      action: user.role === 'admin' ? 'admin_login' : 'director_login',
      performedBy: user._id,
      performedByName: user.name,
      performedByRole: user.role,
      targetModel: 'User',
      targetId: user._id,
      ipAddress: req.ip
    });

    // Create token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        role: user.role,
        mobile: user.mobile,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update user profile (username/password)
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, username, currentPassword, newPassword } = req.body;

    // Find user with password field
    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // If updating password, verify current password
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: 'Please provide current password'
        });
      }

      const isPasswordMatch = await user.comparePassword(currentPassword);

      if (!isPasswordMatch) {
        return res.status(401).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      // Validate new password length
      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 6 characters'
        });
      }

      user.password = newPassword;
    }

    // Update name if provided
    if (name && name.trim() !== '') {
      user.name = name.trim();
    }

    // Update username if provided and different
    if (username && username.trim() !== '' && username !== user.username) {
      // Check if new username already exists
      const existingUser = await User.findOne({ 
        username: username.trim(),
        _id: { $ne: user._id }
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username already exists'
        });
      }

      user.username = username.trim();
    }

    await user.save();

    // Create audit log
    await createAuditLog({
      action: 'profile_updated',
      performedBy: user._id,
      performedByName: user.name,
      performedByRole: user.role,
      targetModel: 'User',
      targetId: user._id,
      newValues: {
        name: user.name,
        username: user.username,
        passwordChanged: !!newPassword
      },
      ipAddress: req.ip
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        role: user.role,
        mobile: user.mobile,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    });
  }
};
