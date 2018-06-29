const jwt = require('jsonwebtoken');
const passport = require('passport');
const config = require('../../config');
const User = require('../models/user');

const respondWithUserAndToken = (res, user) => {
  const token = `Bearer ${user.generateJWT()}`;
  return res
    .status(200)
    .append('Authorization', token)
    .json({
      user: {
        name: user.name,
        email: user.email,
      },
    });
};

const register = async (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res.status(403).json({
      error: 'Please enter all required fields',
    });
  }

  const user = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  user.setPassword(req.body.password);

  user.save((err, user) => {
    if (err) {
      if (err.code === 11000) {
        return res.status(409).json({
          error: 'User already exists',
        });
      }
      return res.status(500).json({
        error: err,
      });
    }
    return respondWithUserAndToken(res, user);
  });
};

const login = (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ error: req.authInfo.message });
  }

  return respondWithUserAndToken(res, user);
};

const profile = (req, res) => {
  return res.status(200).json(req.user);
};

module.exports = {
  register,
  login,
  profile,
};
