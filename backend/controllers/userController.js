import User from '../models/User.js';

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile',
      error: error.message,
    });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { username, phoneNumber, profileImage } = req.body;

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (username) user.username = username;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (profileImage) user.profileImage = profileImage;

    user.updatedAt = new Date();
    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message,
    });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'New passwords do not match',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long',
      });
    }

    const user = await User.findById(req.user.userId).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const isPasswordMatch = await user.comparePassword(currentPassword);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    user.password = newPassword;
    user.updatedAt = new Date();
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: error.message,
    });
  }
};

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const { role, isActive } = req.query;

    let filter = {};

    if (role) {
      filter.role = role;
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message,
    });
  }
};

// Get user by ID (admin only)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: error.message,
    });
  }
};

// Toggle user status (admin only)
export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.isActive = !user.isActive;
    user.updatedAt = new Date();
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user status',
      error: error.message,
    });
  }
};

// Delete user (admin only)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully',
      deletedUser: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message,
    });
  }
};

export default {
  getUserProfile,
  updateUserProfile,
  changePassword,
  getAllUsers,
  getUserById,
  toggleUserStatus,
  deleteUser,
};
