const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { userMiddleware, adminMiddleware } = require('../middleware/auth');
const { sendNotificationToUser, sendNotificationToAllUsers } = require('../services/notificationService');

// GET /api/notifications - Fetch user notifications and unread count
router.get('/', userMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    const unreadCount = await Notification.countDocuments({
      user: req.user._id,
      isRead: false
    });

    res.json({
      success: true,
      notifications,
      unreadCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message
    });
  }
});

// PUT /api/notifications/:id/read - Mark single notification as read
router.put('/:id/read', userMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update notification',
      error: error.message
    });
  }
});

// POST /api/notifications/read/:id - Mark single notification as read
router.post('/read/:id', userMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update notification',
      error: error.message
    });
  }
});

// PUT /api/notifications/read-all - Mark all notifications as read
router.put('/read-all', userMiddleware, async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, isRead: false },
      { isRead: true }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to mark notifications as read',
      error: error.message
    });
  }
});

// POST /api/notifications/read-all - Mark all notifications as read
router.post('/read-all', userMiddleware, async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, isRead: false },
      { isRead: true }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to mark notifications as read',
      error: error.message
    });
  }
});

// DELETE /api/notifications/:id - Delete a notification
router.delete('/:id', userMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification',
      error: error.message
    });
  }
});

// POST /api/notifications/recharge-submit - Log recharge submission
router.post('/recharge-submit', userMiddleware, async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;
    const notification = await Notification.create({
      user: req.user._id,
      type: 'wallet_recharge_submitted',
      title: 'Wallet Recharge Submitted',
      message: `Your recharge request of Rs. ${Number(amount).toLocaleString()} LKR via ${paymentMethod} has been submitted.`,
      amount: Number(amount),
      isRead: false
    });
    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/notifications/admin/send - Send a notification to a specific user
router.post('/admin/send', adminMiddleware, async (req, res) => {
  try {
    const { userId, type, title, message } = req.body;

    if (!userId || !title || !message) {
      return res.status(400).json({
        success: false,
        message: 'userId, title, and message are required'
      });
    }

    const notification = await sendNotificationToUser(userId, type || 'general', title, message);

    res.status(201).json({
      success: true,
      message: 'Notification sent successfully',
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to send notification',
      error: error.message
    });
  }
});

// POST /api/notifications/admin/send-all - Send a notification to all users
router.post('/admin/send-all', adminMiddleware, async (req, res) => {
  try {
    const { type, title, message } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'title and message are required'
      });
    }

    await sendNotificationToAllUsers(type || 'general', title, message);

    res.status(201).json({
      success: true,
      message: 'Notification sent to all users'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to send notifications',
      error: error.message
    });
  }
});

// POST /api/notifications/admin/announcement - Create platform-wide announcement
router.post('/admin/announcement', adminMiddleware, async (req, res) => {
  try {
    const { title, message } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'title and message are required'
      });
    }

    await sendNotificationToAllUsers('announcement', title, message);

    res.status(201).json({
      success: true,
      message: 'Platform announcement created and broadcasted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create platform announcement',
      error: error.message
    });
  }
});

module.exports = router;
