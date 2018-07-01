const express = require('express');
const UserController = require('../controllers/user.controller');
const router = express.Router();

const Post = require('../models/post');

router.get('/users', UserController.index);

router.get('/blobs', (req, res) => {
  return Post.find()
    .exec()
    .then((posts) => {
      return res.status(200).json({
        hell: 'wfewfe',
      });
    })
    .catch((err) => {
      return res.status(500).json({
        not: 'Working'
      })
    });
});

module.exports = router;
