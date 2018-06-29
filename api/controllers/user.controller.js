const User = require('../models/user');

function getUsers(req, res) {
  User.find()
    .select('name email')
    .sort('-createdAt')
    .then((users) => {
      return res.json({ user });
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
}

module.exports = {
  getUsers,
};
