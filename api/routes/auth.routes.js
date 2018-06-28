const express = require('express');
const AuthController = require('../controllers/auth.controller');

const router = express.Router();

// Sign up
router.route('/register').post(AuthController.register);

// Login
router.route('/login').post(AuthController.login);

module.exports = router;
