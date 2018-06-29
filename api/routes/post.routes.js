const express = require('express');
const passport = require('passport');
const PostController = require('../controllers/post.controller');

const router = express.Router();

router.all('/posts', passport.authenticate('jwt', { session: false }));

router.get('/posts', PostController.index);
router.get('/posts/:cuid', PostController.show);
router.post('/posts', PostController.create);
router.put('/posts/:cuid', PostController.update);
router.delete('/posts/:cuid', PostController.destroy);

module.exports = router;
