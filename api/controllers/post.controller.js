const Post = require('../models/post');

const populateAndRespond = (res, post) => {
  Post.populate(post, 'author', (err) => {
    if (err) {
      return res.status(500).json({ err });
    }
    return res.status(200).json({ post });
  });
};

const index = (req, res) => {
  Post.find()
    .sort('-createdAt')
    .populate('author')
    .then((posts) => {
      return res.json(posts);
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
};

const show = (req, res) => {
  Post.findById(req.params.id)
    .populate('author')
    .then((post) => {
      return res.json(post);
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
};

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

    // Populate the author field before returning post object
    return populateAndRespond(res, post);
  });
};

const update = (req, res) => {
  if (!req.body.id || !req.body.title || !req.body.content) {
    return res.status(403).json({
      error: 'Please enter all required fields',
    });
  }

  Post.findById(req.body.id)
    .then((post) => {
      post.title = req.body.title;
      post.content = req.body.content;

      post.save((error, post) => {
        if (error) {
          return res.status(500).json({ error });
        }

        return populateAndRespond(res, post);
      });
    })
    .catch((error) => {
      return res.status(500).json({ error });
    });
};

const destroy = (req, res) => {
  if (!req.body.id) {
    return res.status(403).json({
      error: 'Please enter all required fields',
    });
  }

  Post.deleteOne({ _id: req.body.id })
    .then((post) => {
      return res.json(post);
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
};

module.exports = {
  index,
  show,
  create,
  update,
  destroy,
};
