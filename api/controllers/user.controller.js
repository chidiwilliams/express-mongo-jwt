const User = require('../models/user');

/**
 * Returns all users
 *
 * @param {*} req
 * @param {*} res
 */
const getUsers = (req, res) => {
  User.find()
    .sort('-createdAt')
    .then((users) => {
      return res.status(200).json({ users });
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
};

module.exports = {
  getUsers,
};
