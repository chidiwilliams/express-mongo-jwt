const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');

router.route('/users').get(UserController.getAll);

module.exports = router;
