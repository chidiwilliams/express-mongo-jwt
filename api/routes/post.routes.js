const express = require('express');
const passport = require('passport');
const PostController = require('../controllers/post.controller');
const createError = require('http-errors');

const router = express.Router();

router.all('/posts', passport.authenticate('jwt', { session: false }));

router.get('/posts', PostController.index);
router.get('/posts/:id', PostController.show);
router.post('/posts', PostController.create);
router.put('/posts/:id', PostController.update);
router.delete('/posts/:id', PostController.destroy);

module.exports = router;
