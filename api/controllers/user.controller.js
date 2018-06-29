const User = require('../models/user');

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
