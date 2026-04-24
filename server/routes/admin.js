const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const { protect, generateToken } = require('../middleware/auth');

// POST /api/admin/login - Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find admin and include password
    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin || !admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials or account deactivated'
      });
    }

    // Check password
    const isPasswordValid = await admin.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    await admin.updateLastLogin();

    // Generate token
    const token = generateToken(admin._id);

    // Send response
    res.json({
      success: true,
      data: {
        token,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          lastLogin: admin.lastLogin
        }
      },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
});

// GET /api/admin/profile - Get admin profile (protected)
router.get('/profile', protect, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);

    res.json({
      success: true,
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin,
        isActive: admin.isActive,
        createdAt: admin.createdAt
      }
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
});

// PUT /api/admin/profile - Update admin profile (protected)
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, email } = req.body;
    
    // Check if email is being changed and if it already exists
    if (email && email !== req.admin.email) {
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use'
        });
      }
    }

    const admin = await Admin.findByIdAndUpdate(
      req.admin._id,
      { name, email },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        updatedAt: admin.updatedAt
      },
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
});

// PUT /api/admin/password - Change admin password (protected)
router.put('/password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current password and new password'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    // Get admin with password
    const admin = await Admin.findById(req.admin._id).select('+password');

    // Verify current password
    const isCurrentPasswordValid = await admin.comparePassword(currentPassword);

    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(400).json({
      success: false,
      message: 'Error changing password',
      error: error.message
    });
  }
});

// POST /api/admin/register - Create new admin (super admin only)
router.post('/register', protect, async (req, res) => {
  try {
    // Check if current admin is super admin
    if (req.admin.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Only super admins can create new admin accounts'
      });
    }

    const { name, email, password, role = 'admin' } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin with this email already exists'
      });
    }

    // Create new admin
    const admin = new Admin({
      name,
      email,
      password,
      role
    });

    await admin.save();

    res.status(201).json({
      success: true,
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        isActive: admin.isActive,
        createdAt: admin.createdAt
      },
      message: 'Admin created successfully'
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating admin',
      error: error.message
    });
  }
});

// GET /api/admin/verify - Verify token and get admin info (protected)
router.get('/verify', protect, (req, res) => {
  res.json({
    success: true,
    data: {
      admin: {
        id: req.admin._id,
        name: req.admin.name,
        email: req.admin.email,
        role: req.admin.role
      }
    },
    message: 'Token is valid'
  });
});

module.exports = router;
