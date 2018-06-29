const express = require('express');
const router = express.Router();
const PostController = require('../controllers/post.controller');

router.route('/posts').get(PostController.getPosts);
router.route('/posts/:cuid').get(PostController.getPost);
router.route('/posts').post(PostController.addPost);
router.route('/posts/:cuid').put(PostController.updatePost);
router.route('/posts/:cuid').delete(PostController.deletePost);

module.exports = router;
