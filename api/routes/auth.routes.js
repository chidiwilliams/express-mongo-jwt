const express = require('express');
const AuthController = require('../controllers/auth.controller');
const passport = require('passport');
const router = express.Router();
const debug = require('debug')('express-mongo-jwt:authroutes');

const jwt = require('jsonwebtoken');
const config = require('../../config');

router.post('/register', AuthController.register);
router.post(
  '/login',
  passport.authenticate('local', { session: false }),
  AuthController.login
);
router.get(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  function(req, res) {
    res.send({
      user: {
        name: req.user.name,
        email: req.user.email,
      },
    });
  }
);
// router.get(
//   '/profile',
//   passport.authenticate('jwt', { session: false }),
//   AuthController.profile
// );

module.exports = router;
