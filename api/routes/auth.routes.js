const express = require('express');
const AuthController = require('../controllers/auth.controller');
const passport = require('passport');
const router = express.Router();
const debug = require('debug')('express-mongo-jwt:authroutes');

router.post('/register', AuthController.register);
router.post(
  '/login',
  passport.authenticate('local', { session: false }),
  AuthController.login
);
router.get(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  AuthController.profile
);

module.exports = router;
