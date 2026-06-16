const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Admin = require('../models/Admin');
const { protect, generateToken } = require('../middleware/auth');
const { sendEmail, hasSmtpConfig } = require('../utils/sendEmail');

const isSmtpDeliveryError = (error) =>
  error?.code === 'SMTP_CONNECTION_FAILED' || String(error?.message || '').toLowerCase().includes('smtp');

const getEmailDeliveryErrorResponse = (error, fallbackMessage) => {
  if (isSmtpDeliveryError(error)) {
    return {
      status: 503,
      message: fallbackMessage,
    };
  }
  return {
    status: 500,
    message: error.message || fallbackMessage,
  };
};
const INVALID_LOGIN_MESSAGE = 'Invalid email or password';

const normalizeEmail = (value = '') => value.trim().toLowerCase();

const getSafeAdmin = (admin) => ({
  id: admin._id,
  name: admin.name,
  email: admin.email,
  role: admin.role || 'admin',
  lastLogin: admin.lastLogin,
});

const ensureEnvAdminRecord = async () => {
  const envEmail = normalizeEmail(process.env.ADMIN_EMAIL);
  const envPassword = process.env.ADMIN_PASSWORD || '';

  if (!envEmail || !envPassword) {
    return null;
  }

  let admin = await Admin.findOne({ email: envEmail });

  if (!admin) {
    admin = await Admin.create({
      name: 'Admin',
      email: envEmail,
      password: envPassword,
      role: 'admin',
      isActive: true,
    });
  } else if (!admin.isActive) {
    admin.isActive = true;
    await admin.save();
  }

  return admin;
};

// POST /api/admin/login - Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('[Admin Login] Admin login attempt');

    // Validate input
    if (!email || !password) {
      console.log('[Admin Login] Missing email or password');
      return res.status(400).json({
        success: false,
        message: INVALID_LOGIN_MESSAGE
      });
    }

    const normalizedEmail = normalizeEmail(email);
    const envEmail = normalizeEmail(process.env.ADMIN_EMAIL);
    const envPassword = process.env.ADMIN_PASSWORD || '';

    console.log('[Admin Login] Email received', {
      email: normalizedEmail,
    });

    if (normalizedEmail === envEmail && password === envPassword) {
      console.log('[Admin Login] Admin match success from env');
      const admin = await ensureEnvAdminRecord();

      if (!admin) {
        console.log('[Admin Login] Admin env configured incorrectly');
        return res.status(500).json({
          success: false,
          message: 'Admin account is not configured correctly'
        });
      }

      await admin.updateLastLogin();
      const token = generateToken(admin);

      console.log('[Admin Login] JWT generation status', {
        success: Boolean(token),
        role: 'admin',
        adminId: String(admin._id),
        email: admin.email,
      });

      return res.json({
        success: true,
        data: {
          token,
          role: 'admin',
          redirectTo: '/admin/dashboard',
          admin: getSafeAdmin(admin)
        },
        message: 'Login successful'
      });
    }

    console.log('[Admin Login] Admin env match failure, checking admin database');

    // Find admin and include password
    const admin = await Admin.findOne({ email: normalizedEmail }).select('+password');

    if (!admin || !admin.isActive) {
      console.log('[Admin Login] Admin database lookup failed or inactive');
      return res.status(401).json({
        success: false,
        message: INVALID_LOGIN_MESSAGE
      });
    }

    // Check password
    const isPasswordValid = await admin.comparePassword(password);

    if (!isPasswordValid) {
      console.log('[Admin Login] Admin database password mismatch', {
        email: normalizedEmail,
      });
      return res.status(401).json({
        success: false,
        message: INVALID_LOGIN_MESSAGE
      });
    }

    // Update last login
    await admin.updateLastLogin();

    // Generate token
    const token = generateToken(admin);

    console.log('[Admin Login] JWT generation status', {
      success: Boolean(token),
      role: 'admin',
      adminId: String(admin._id),
      email: admin.email,
    });

    // Send response
    res.json({
      success: true,
      data: {
        token,
        role: 'admin',
        redirectTo: '/admin/dashboard',
        admin: getSafeAdmin(admin)
      },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('[Admin Login] Login error:', error);
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

// POST /api/admin/forgot-password - Admin forgot password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Please enter your email address' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const admin = await Admin.findOne({ email: normalizedEmail }).select('+resetPasswordToken +resetPasswordExpire');

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin email address was not found' });
    }

    const rawToken = admin.createPasswordResetToken();
    await admin.save({ validateBeforeSave: false });

    const baseUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/admin/reset-password?token=${rawToken}`;

    if (!hasSmtpConfig()) {
      admin.resetPasswordToken = undefined;
      admin.resetPasswordExpire = undefined;
      await admin.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        message: 'Email service is not configured yet. Please contact developer.',
      });
    }

    try {
      await sendEmail({
        to: admin.email,
        subject: 'Reset your YATHU ADMIN Control Panel password',
        text: `Reset your YATHU ADMIN password using this secure link: ${resetUrl}`,
        html: `
          <div style="font-family: Arial, sans-serif; background: #0a0a0a; color: #f5f5f5; padding: 32px;">
            <div style="max-width: 560px; margin: 0 auto; background: #111111; border: 1px solid rgba(168,85,247,0.2); border-radius: 20px; overflow: hidden;">
              <div style="height: 4px; background: linear-gradient(90deg, transparent, #a855f7, transparent);"></div>
              <div style="padding: 32px;">
                <p style="color: #c084fc; font-size: 12px; letter-spacing: 0.28em; text-transform: uppercase; font-weight: 700; margin: 0 0 16px;">YATHU ADMIN PANEL</p>
                <h1 style="margin: 0 0 16px; font-size: 28px; line-height: 1.2;">Reset Your Admin Password</h1>
                <p style="margin: 0 0 24px; color: #d1d5db; line-height: 1.7;">
                  We received a request to reset your admin account password. Use the secure button below to choose a new password.
                </p>
                <a href="${resetUrl}" style="display: inline-block; padding: 14px 24px; border-radius: 14px; background: linear-gradient(135deg, #7c3aed, #a855f7); color: #ffffff; text-decoration: none; font-weight: 700;">
                  Reset Password
                </a>
                <p style="margin: 24px 0 0; color: #9ca3af; line-height: 1.7;">
                  This link expires in 30 minutes. If you did not request this reset, you can safely ignore this email.
                </p>
                <p style="margin: 16px 0 0; color: #9ca3af; word-break: break-all;">
                  ${resetUrl}
                </p>
              </div>
            </div>
          </div>
        `,
      });
    } catch (emailError) {
      admin.resetPasswordToken = undefined;
      admin.resetPasswordExpire = undefined;
      await admin.save({ validateBeforeSave: false });

      if (!isSmtpDeliveryError(emailError)) {
        throw emailError;
      }

      console.error('[Admin Forgot Password] Reset email failed:', emailError.message);
      return res.status(503).json({
        success: false,
        message: 'Password reset email could not be sent right now. Please try again later.',
      });
    }

    return res.json({
      success: true,
      message: 'Reset link sent to your email',
      data: process.env.NODE_ENV === 'development' ? { resetUrl } : undefined,
    });
  } catch (error) {
    const deliveryError = getEmailDeliveryErrorResponse(error, 'Failed to send reset link');
    return res.status(deliveryError.status).json({
      success: false,
      message: deliveryError.message,
    });
  }
});

// POST /api/admin/reset-password - Admin reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, message: 'Reset token is required' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password and confirm password do not match',
      });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const admin = await Admin.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: new Date() },
    }).select('+password +resetPasswordToken +resetPasswordExpire');

    if (!admin) {
      return res.status(400).json({
        success: false,
        message: 'Reset token is invalid or expired',
      });
    }

    admin.password = password;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpire = undefined;
    await admin.save();

    return res.json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    console.error('[Admin Reset Password] Reset failed:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to reset password',
      error: error.message,
    });
  }
});

module.exports = router;
