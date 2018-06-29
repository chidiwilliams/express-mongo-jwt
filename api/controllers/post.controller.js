const Post = require('../models/post');

function getPosts(req, res) {
  Post.find()
    .sort('-createdAt')
    .then((posts) => {
      return res.json(posts);
    })
    .catch((err) => {
      return res.status(500).json(err);
    })
}

function getPost(req, res) {}

function addPost(req, res) {}

function updatePost(req, res) {}

function deletePost(req, res) {}

module.exports = {
  getPosts,
  getPost,
  addPost,
  updatePost,
  deletePost,
};
