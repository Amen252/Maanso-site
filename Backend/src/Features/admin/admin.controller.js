import User from '../users/user.model.js';
import Gabay from '../Gabay/gabay.model.js';

// Get system statistics for the admin dashboard
export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalGabays = await Gabay.countDocuments();

    // Group users by role
    const roleStats = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    const formattedRoleStats = {
      Admin: 0,
      Abwaan: 0,
      Viewer: 0,
    };

    roleStats.forEach(stat => {
      if (formattedRoleStats[stat._id] !== undefined) {
        formattedRoleStats[stat._id] = stat.count;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalGabays,
        roles: formattedRoleStats,
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve stats',
      error: error.message
    });
  }
};

// Retrieve all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve users',
      error: error.message
    });
  }
};

// Update user role (admin only)
export const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const validRoles = ['Admin', 'Abwaan', 'Viewer'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({
      success: false,
      message: `Invalid role. Must be one of: ${validRoles.join(', ')}`
    });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent changing own role (or safeguard at least one Admin)
    if (user._id.toString() === req.user._id.toString() && role !== 'Admin') {
      return res.status(400).json({
        success: false,
        message: 'You cannot demote yourself from Admin status'
      });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      data: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update user role',
      error: error.message
    });
  }
};

// Delete a user (admin only)
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deleting oneself
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own admin account'
      });
    }

    // Optional: Delete user's associated Gabays
    await Gabay.deleteMany({ author: id });
    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'User and all their associated poems deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
};

// Moderation: Delete any Gabay (admin only)
export const deleteGabay = async (req, res) => {
  const { id } = req.params;

  try {
    const gabay = await Gabay.findById(id);
    if (!gabay) {
      return res.status(404).json({
        success: false,
        message: 'Gabay not found'
      });
    }

    await Gabay.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Gabay (poem) deleted successfully by administrator'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete Gabay',
      error: error.message
    });
  }
};

// Admin: Create any Gabay
export const createGabay = async (req, res) => {
  const { title, content, author } = req.body;
  if (!title || !content) {
    return res.status(400).json({
      success: false,
      message: 'Title and content are required'
    });
  }

  try {
    const gabay = new Gabay({
      title,
      content,
      author: author || req.user._id // defaults to current admin if author is not specified
    });

    await gabay.save();

    res.status(201).json({
      success: true,
      message: 'Gabay created successfully by administrator',
      data: gabay
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create Gabay',
      error: error.message
    });
  }
};

// Admin: Get all Gabays with full info
export const getAllGabays = async (req, res) => {
  try {
    const gabays = await Gabay.find()
      .populate('author', 'username')
      .populate('comments.author', 'username')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: gabays
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve Gabays',
      error: error.message
    });
  }
};

// Admin: Update any Gabay
export const updateGabay = async (req, res) => {
  const { id } = req.params;

  try {
    const gabay = await Gabay.findById(id);
    if (!gabay) {
      return res.status(404).json({
        success: false,
        message: 'Gabay not found'
      });
    }

    Object.assign(gabay, req.body);
    await gabay.save();

    res.status(200).json({
      success: true,
      message: 'Gabay updated successfully by administrator',
      data: gabay
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update Gabay',
      error: error.message
    });
  }
};
