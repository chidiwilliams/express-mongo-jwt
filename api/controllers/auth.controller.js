const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/user');

const respondWithUserAndToken = (res, user) => {
  const token = `Bearer ${user.generateJWT()}`;
  return res
    .status(200)
    .append('Authorization', token)
    .json({ user });
};

const register = (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res.status(403).json({
      error: 'Please enter all required fields',
    });
  }

  const user = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  user.setPassword(req.body.password);

  user.save((error, user) => {
    if (error) {
      if (error.code === 11000) {
        return res.status(409).json({
          error: 'User already exists',
        });
      }
      return res.status(500).json({ error });
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
  return res.status(200).json({ user: req.user });
};

module.exports = {
  register,
  login,
  profile,
};
