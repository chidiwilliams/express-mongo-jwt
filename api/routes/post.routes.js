const express = require('express');
const router = express.Router();
const PostController = require('../controllers/post.controller');

router.get('/posts', PostController.getPosts);
router.get('/posts/:cuid', PostController.getPost);
router.post('/posts', PostController.addPost);
router.put('/posts/:cuid', PostController.updatePost);
router.delete('/posts/:cuid', PostController.deletePost);

module.exports = router;
