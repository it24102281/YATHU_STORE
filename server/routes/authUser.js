const crypto = require('crypto');
const express = require('express');
const validator = require('validator');
const Admin = require('../models/Admin');
const User = require('../models/User');
const { generateToken, generateUserToken, userMiddleware } = require('../middleware/auth');
const { sendEmail, hasSmtpConfig } = require('../utils/sendEmail');

const router = express.Router();

const whatsappRegex = /^[0-9+\-\s()]{8,20}$/;
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
const INVALID_LOGIN_MESSAGE = 'Invalid email or password';

const getSignupErrorResponse = (error) => {
  if (error?.code === 11000) {
    if (error.keyPattern?.email) {
      return { status: 409, message: 'Email already exists' };
    }

    if (error.keyPattern?.whatsappNumber) {
      return { status: 409, message: 'WhatsApp number already exists' };
    }
  }

  if (error?.name === 'ValidationError') {
    const firstMessage = Object.values(error.errors || {})[0]?.message;
    return {
      status: 400,
      message: firstMessage || 'Please check your signup details and try again',
    };
  }

  if (error?.code === 'SMTP_CONNECTION_FAILED' || String(error?.message || '').toLowerCase().includes('smtp')) {
    return {
      status: 500,
      message: 'Verification email could not be sent right now. Please try again in a moment.',
    };
  }

  return {
    status: 500,
    message: 'Failed to start signup verification',
  };
};

const getEmailDeliveryErrorResponse = (error, fallbackMessage) => {
  const normalizedMessage = String(error?.message || '').trim();

  if (error?.code === 'SMTP_CONNECTION_FAILED' || normalizedMessage.toLowerCase().includes('smtp')) {
    return {
      status: 500,
      message: fallbackMessage,
    };
  }

  return {
    status: 500,
    message: fallbackMessage,
  };
};

const getSafeUser = (user) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  whatsappNumber: user.whatsappNumber,
  role: user.role,
  isEmailVerified: user.isEmailVerified,
  status: user.isBlocked ? 'Blocked' : 'Active',
  walletBalance: Number(user.walletBalance || 0),
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const getSafeAdmin = (admin) => ({
  id: admin._id,
  name: admin.name,
  email: admin.email,
  role: admin.role || 'admin',
  lastLogin: admin.lastLogin,
});

const normalizeEmail = (value = '') => value.trim().toLowerCase();
const normalizeIdentifier = (value = '') => value.trim();

const ensureEnvAdminRecord = async () => {
  const adminEmail = normalizeEmail(process.env.ADMIN_EMAIL);
  const adminPassword = process.env.ADMIN_PASSWORD || '';

  if (!adminEmail || !adminPassword) {
    return null;
  }

  let admin = await Admin.findOne({ email: adminEmail });

  if (!admin) {
    admin = await Admin.create({
      name: 'Admin',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      isActive: true,
    });
  } else if (!admin.isActive) {
    admin.isActive = true;
    await admin.save();
  }

  return admin;
};

const sendSignupVerificationEmail = async (user, code) => {
  await sendEmail({
    to: user.email,
    subject: 'Your YATHU PUBG STORE signup verification code',
    text: `Your YATHU PUBG STORE verification code is ${code}. This code expires in 10 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; background: #0a0a0a; color: #f5f5f5; padding: 32px;">
        <div style="max-width: 560px; margin: 0 auto; background: #111111; border: 1px solid rgba(168,85,247,0.2); border-radius: 20px; overflow: hidden;">
          <div style="height: 4px; background: linear-gradient(90deg, transparent, #a855f7, transparent);"></div>
          <div style="padding: 32px;">
            <p style="color: #c084fc; font-size: 12px; letter-spacing: 0.28em; text-transform: uppercase; font-weight: 700; margin: 0 0 16px;">YATHU PUBG STORE</p>
            <h1 style="margin: 0 0 16px; font-size: 28px; line-height: 1.2;">Verify Your Signup</h1>
            <p style="margin: 0 0 24px; color: #d1d5db; line-height: 1.7;">
              Enter this verification code in the signup page to finish creating your customer account.
            </p>
            <div style="display: inline-block; padding: 16px 22px; border-radius: 16px; background: rgba(168,85,247,0.16); border: 1px solid rgba(168,85,247,0.35); color: #ffffff; font-size: 28px; font-weight: 800; letter-spacing: 0.3em;">
              ${code}
            </div>
            <p style="margin: 24px 0 0; color: #9ca3af; line-height: 1.7;">
              This code expires in 10 minutes. If you did not request this, you can ignore this email.
            </p>
          </div>
        </div>
      </div>
    `,
  });
};

router.post('/signup', async (req, res) => {
  try {
    const { fullName, email, whatsappNumber, password, confirmPassword } = req.body;

    if (!fullName?.trim()) {
      return res.status(400).json({ success: false, message: 'Please enter your full name' });
    }

    if (!validator.isEmail(email || '')) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address' });
    }

    if (!whatsappRegex.test(whatsappNumber || '')) {
      return res.status(400).json({ success: false, message: 'Please enter your WhatsApp number' });
    }

    if (!strongPasswordRegex.test(password || '')) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters and include uppercase, lowercase, and a number',
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password and confirm password do not match',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const trimmedWhatsapp = whatsappNumber.trim();

    const [existingEmail, existingWhatsapp] = await Promise.all([
      User.findOne({ email: normalizedEmail }).select('+signupVerificationCode +signupVerificationExpire +password'),
      User.findOne({ whatsappNumber: trimmedWhatsapp }).select('+signupVerificationCode +signupVerificationExpire +password'),
    ]);

    if (existingEmail && existingEmail.isEmailVerified) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    if (existingWhatsapp && String(existingWhatsapp._id) !== String(existingEmail?._id)) {
      return res.status(400).json({ success: false, message: 'WhatsApp number already exists' });
    }

    if (!hasSmtpConfig()) {
      return res.status(500).json({
        success: false,
        message: 'Email service is not configured yet. Please contact admin.',
      });
    }

    const user = existingEmail || new User({ email: normalizedEmail });
    user.fullName = fullName.trim();
    user.email = normalizedEmail;
    user.whatsappNumber = trimmedWhatsapp;
    user.password = password;
    user.role = 'customer';
    user.isBlocked = false;
    user.isEmailVerified = false;

    const signupCode = user.createSignupVerificationCode();
    await user.save();
    await sendSignupVerificationEmail(user, signupCode);

    return res.status(200).json({
      success: true,
      message: 'Verification code sent to your email',
      data: {
        email: user.email,
      },
    });
  } catch (error) {
    const signupError = getSignupErrorResponse(error);

    return res.status(signupError.status).json({
      success: false,
      message: signupError.message,
    });
  }
});

router.post('/verify-signup', async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!validator.isEmail(email || '')) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address' });
    }

    if (!/^\d{6}$/.test(code || '')) {
      return res.status(400).json({ success: false, message: 'Please enter the 6-digit verification code' });
    }

    const hashedCode = crypto.createHash('sha256').update(code).digest('hex');
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      signupVerificationCode: hashedCode,
      signupVerificationExpire: { $gt: new Date() },
    }).select('+signupVerificationCode +signupVerificationExpire');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Verification code is invalid or expired',
      });
    }

    user.isEmailVerified = true;
    user.signupVerificationCode = undefined;
    user.signupVerificationExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
      success: true,
      message: 'Account created successfully',
      data: {
        user: getSafeUser(user),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to verify signup code',
      error: error.message,
    });
  }
});

router.post('/resend-signup-code', async (req, res) => {
  try {
    const { email } = req.body;

    if (!validator.isEmail(email || '')) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address' });
    }

    if (!hasSmtpConfig()) {
      return res.status(500).json({
        success: false,
        message: 'Email service is not configured yet. Please contact admin.',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+signupVerificationCode +signupVerificationExpire');

    if (!user || user.isEmailVerified) {
      return res.status(404).json({ success: false, message: 'Pending signup account not found' });
    }

    const signupCode = user.createSignupVerificationCode();
    await user.save({ validateBeforeSave: false });
    await sendSignupVerificationEmail(user, signupCode);

    return res.json({
      success: true,
      message: 'Verification code resent successfully',
    });
  } catch (error) {
    const deliveryError = getEmailDeliveryErrorResponse(error, 'Failed to resend verification code');

    return res.status(deliveryError.status).json({
      success: false,
      message: deliveryError.message,
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;

    console.log('[Auth Login] Admin login attempt via shared login route');

    if (!identifier?.trim() || !password) {
      console.log('[Auth Login] Missing identifier or password');
      return res.status(400).json({
        success: false,
        message: INVALID_LOGIN_MESSAGE,
      });
    }

    const normalizedIdentifier = normalizeIdentifier(identifier);
    const normalizedEmail = validator.isEmail(normalizedIdentifier)
      ? normalizeEmail(normalizedIdentifier)
      : '';
    const envAdminEmail = normalizeEmail(process.env.ADMIN_EMAIL);
    const envAdminPassword = process.env.ADMIN_PASSWORD || '';

    console.log('[Auth Login] Email received', {
      identifier: normalizedIdentifier,
      normalizedEmail: normalizedEmail || null,
    });

    if (
      normalizedEmail &&
      envAdminEmail &&
      normalizedEmail === envAdminEmail &&
      password === envAdminPassword
    ) {
      console.log('[Auth Login] Admin match success');
      const admin = await ensureEnvAdminRecord();

      if (!admin) {
        console.log('[Auth Login] Admin env configured incorrectly');
        return res.status(500).json({
          success: false,
          message: 'Admin account is not configured correctly',
        });
      }

      await admin.updateLastLogin();
      const token = generateToken(admin);

      console.log('[Auth Login] JWT generation status', {
        success: Boolean(token),
        role: 'admin',
        adminId: String(admin._id),
        email: admin.email,
      });

      return res.json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          role: 'admin',
          redirectTo: '/admin/dashboard',
          admin: getSafeAdmin(admin),
        },
      });
    }

    console.log('[Auth Login] Admin match failure, continuing to normal user lookup');

    const query = validator.isEmail(normalizedIdentifier)
      ? { email: normalizedEmail }
      : { whatsappNumber: normalizedIdentifier };

    const user = await User.findOne(query).select('+password');

    if (!user) {
      console.log('[Auth Login] Normal user lookup failed');
      return res.status(401).json({ success: false, message: INVALID_LOGIN_MESSAGE });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email before signing in.',
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been blocked. Please contact admin.',
      });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      console.log('[Auth Login] Normal user password mismatch', {
        email: user.email,
      });
      return res.status(401).json({ success: false, message: INVALID_LOGIN_MESSAGE });
    }

    const token = generateUserToken(user);

    console.log('[Auth Login] JWT generation status', {
      success: Boolean(token),
      role: 'user',
      userId: String(user._id),
      email: user.email,
    });

    return res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        role: 'user',
        redirectTo: '/user/dashboard',
        user: getSafeUser(user),
      },
    });
  } catch (error) {
    console.log('[Auth Login] Login route error', {
      message: error.message,
    });
    return res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message,
    });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!validator.isEmail(email || '')) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+resetPasswordToken +resetPasswordExpire');

    if (!user) {
      return res.status(404).json({ success: false, message: 'Email address was not found' });
    }

    const rawToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const baseUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/user/reset-password?token=${rawToken}`;

    if (!hasSmtpConfig()) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        message: 'Email service is not configured yet. Please contact admin.',
      });
    }

    await sendEmail({
      to: user.email,
      subject: 'Reset your YATHU PUBG STORE password',
      text: `Reset your YATHU PUBG STORE password using this secure link: ${resetUrl}`,
      html: `
        <div style="font-family: Arial, sans-serif; background: #0a0a0a; color: #f5f5f5; padding: 32px;">
          <div style="max-width: 560px; margin: 0 auto; background: #111111; border: 1px solid rgba(168,85,247,0.2); border-radius: 20px; overflow: hidden;">
            <div style="height: 4px; background: linear-gradient(90deg, transparent, #a855f7, transparent);"></div>
            <div style="padding: 32px;">
              <p style="color: #c084fc; font-size: 12px; letter-spacing: 0.28em; text-transform: uppercase; font-weight: 700; margin: 0 0 16px;">YATHU PUBG STORE</p>
              <h1 style="margin: 0 0 16px; font-size: 28px; line-height: 1.2;">Reset Your Password</h1>
              <p style="margin: 0 0 24px; color: #d1d5db; line-height: 1.7;">
                We received a request to reset your customer account password. Use the secure button below to choose a new password.
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

router.post('/reset-password', async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, message: 'Reset token is required' });
    }

    if (!strongPasswordRegex.test(password || '')) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters and include uppercase, lowercase, and a number',
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password and confirm password do not match',
      });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: new Date() },
    }).select('+password +resetPasswordToken +resetPasswordExpire');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Reset token is invalid or expired',
      });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return res.json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to reset password',
      error: error.message,
    });
  }
});

router.post('/logout', userMiddleware, async (req, res) => {
  return res.json({
    success: true,
    message: 'Logout successful',
  });
});

module.exports = router;
