const express = require('express');
const UserController = require('../controllers/user.controller');
const Post = require('../models/post');

const router = express.Router();

router.get('/users', UserController.index);

module.exports = router;
