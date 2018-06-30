const Post = require('../models/post');

/**
 * Populates the Post object before sending response
 *
 * @param {*} res
 * @param {*} post
 */
const populateAndRespond = (res, post) => {
  Post.populate(post, 'author', (err) => {
    if (err) {
      return res.status(500).json({ err });
    }
    return res.status(200).json({ post });
  });
};

/**
 * Return all posts
 *
 * @param {*} req
 * @param {*} res
 */
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

/**
 * Returns one post by id in req.params.id
 *
 * @param {*} req
 * @param {*} res
 */
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

/**
 * Create a post.
 * Required: req.body.title and req.body.content
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
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

/**
 * Update a post by id in req.params.id
 * Required: req.body.title and req.body.content
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
update = (req, res) => {
  if (!req.body.title || !req.body.content) {
    return res.status(403).json({
      error: 'Please enter all required fields',
    });
  }

  Post.findById(req.params.id)
    .then((post) => {
      post.title = req.body.title;
      post.content = req.body.content;

      post.save((error, post) => {
        if (error) {
          return res.status(500).json({ error });
        }

        // Populate the author field before returning post object
        return populateAndRespond(res, post);
      });
    })
    .catch((error) => {
      return res.status(500).json({ error });
    });
};

/**
 * Delete a post by id in req.params.id
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
const destroy = (req, res) => {
  Post.deleteOne({ _id: req.params.id })
    .then((post) => {
      return res.json({
        message: 'Deleted successfully',
      });
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
