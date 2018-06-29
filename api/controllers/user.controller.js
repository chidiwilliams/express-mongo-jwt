const User = require('../models/user');

const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('name email -_id')
      .sort('-createdAt');
    return res.status(200).json({ users });
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = {
  getUsers,
};
