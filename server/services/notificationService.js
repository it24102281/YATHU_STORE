const Notification = require('../models/Notification');
const User = require('../models/User');

const sendNotificationToUser = async (userId, type, title, message, extra = {}) => {
  try {
    return await Notification.create({
      user: userId,
      type,
      title,
      message,
      orderId: extra.orderId,
      refillId: extra.refillId,
      amount: extra.amount,
      isRead: false
    });
  } catch (error) {
    console.error(`[Notification Service] Failed to send notification to user ${userId}:`, error.message);
  }
};

const sendNotificationToAllUsers = async (type, title, message, extra = {}) => {
  try {
    const users = await User.find({ isBlocked: false }).select('_id');
    if (users.length === 0) return;

    const notifications = users.map(user => ({
      user: user._id,
      type,
      title,
      message,
      orderId: extra.orderId,
      refillId: extra.refillId,
      amount: extra.amount,
      isRead: false
    }));

    await Notification.insertMany(notifications);
  } catch (error) {
    console.error('[Notification Service] Failed to send notification to all users:', error.message);
  }
};

module.exports = {
  sendNotificationToUser,
  sendNotificationToAllUsers
};
