const User = require('../models/user');

function getAll(req, res) {
  User.find()
    .select('name email -_id')
    .sort('-dateAdded')
    .exec((err, users) => {
      if (err) {
        return res.status(500).send(err);
      }
      return res.json({ users });
    });
}

module.exports = {
  getAll,
};
