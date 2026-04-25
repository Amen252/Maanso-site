import User from './user.model.js';

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: "Only admins can view all users" });
    }
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};
