const Post = require('../models/post');

const index = (req, res) => {
  Post.find()
    .sort('-createdAt')
    .then((posts) => {
      return res.json(posts);
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
};

const show = (req, res) => {};

const create = (req, res) => {
  if (!req.body.title || !req.body.content) {
    return res.status(403).json({
      error: 'Please enter all required fields',
    });
  }

  const post = new Post();
  post.title = req.body.title;
  post.content = req.body.content;
  // Generate random ID for the post
  post.author = req.user._id;

  post.save((err, post) => {
    if (err) {
      return res.status(500).json({ err });
    }
    return res.status(200).json({ post });
  });
};

const update = (req, res) => {};

const destroy = (req, res) => {};

module.exports = {
  index,
  show,
  create,
  update,
  destroy,
};
