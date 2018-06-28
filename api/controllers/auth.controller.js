const jwt = require('jsonwebtoken');
const config = require('../../config');
const debug = require('debug')('express-mongo-jwt:auth');
const User = require('../models/user');

function register(req, res) {
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res.status(403).json({
      message: 'Please enter all required fields',
    });
  }

  const user = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  user.setPassword(req.body.password);

  user
    .save()
    .then((createdUser) => {
      return res
        .status(200)
        .append('Authorization', 'Bearer ' + createdUser.generateJWT())
        .json({
          user: createdUser,
        });
    })
    .catch((err) => {
      debug(err);
      if (err.code === 11000) {
        return res.status(409).json({
          message: 'User already exists',
        });
      } else {
        return res.status(500).json({
          error: err,
        });
      }
    });
}

function login(req, res) {
  if (!req.body.username || !req.body.password) {
    return res.status(403).json({});
  }

  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ username }, (err, user) => {
    if (err) {
      return res.status(500).send(err);
    }

    if (!user) {
      return res.status(401).send({
        success: false,
        msg: 'Authentication failed. User not found.',
      });
    }

    // check if password matches
    user.comparePassword(password, (passwordError, isMatch) => {
      if (passwordError || !isMatch) {
        return res.status(401).send({
          success: false,
          msg: 'Authentication failed',
        });
      }

      const token = jwt.sign(user, config.appSecret);
      return res.json({
        success: true,
        token: `JWT ${token}`,
      });
    });
  });
}

module.exports = {
  register,
  login,
};
