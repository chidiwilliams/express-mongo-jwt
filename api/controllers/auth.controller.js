const jwt = require('jsonwebtoken');
const passport = require('passport');
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
  passport.authenticate('local', { session: false }, (err, user, db_error) => {
    if (err) {
      return res.status(500).json(err);
    }

    if (!user) {
      return res.status(401).json(db_error);
    }

    req.login(user, { session: false }, (err) => {
      if (err) {
        return res.status(500).json(err);
      }

      return res
        .status(200)
        .append('Authorization', 'Bearer ' + user.generateJWT())
        .json({
          user: {
            name: user.name,
            email: user.email,
          },
        });
    });
  })(req, res);
}

function profile(req, res) {
  return res.status(200).json(req.user);
}

module.exports = {
  register,
  login,
  profile,
};
