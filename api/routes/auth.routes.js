const express = require('express');
const AuthController = require('../controllers/auth.controller');
const passport = require('../../util/passport');

const router = express.Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  AuthController.profile
);

module.exports = router;
