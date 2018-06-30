const User = require('../models/user');

/**
 * Returns all users
 *
 * @param {*} req
 * @param {*} res
 */
const index = async (req, res) => {
  try {
    const users = await User.find()
      .sort('-createdAt')
      .exec();
    return res.status(200).json({ users });
  } catch (error) {
    return next(createError(500, error));
  }
};

module.exports = {
  index,
};
