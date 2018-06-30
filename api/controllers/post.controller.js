const Post = require('../models/post');
const createError = require('http-errors');

/**
 * Populates the Post object before sending response
 *
 * @param {*} res
 * @param {*} posts
 * @param {*} next
 */
const populateAndRespond = (posts, res, next) => {
  Post.populate(posts, 'author', (err) => {
    if (err) {
      return next(createError(500, err));
    }

    // Returns object key as post if only one post is received,
    // but posts if multiple posts are received
    return posts.length === 1
      ? res.status(200).json({ post: posts })
      : res.status(200).json({ posts });
  });
};

/**
 * Return all posts
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const index = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .sort('-createdAt')
      .exec();
    return populateAndRespond(posts, res, next);
  } catch (error) {
    return next(createError(500, error));
  }
};

/**
 * Returns one post by id in req.params.id
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const show = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).exec();
    return populateAndRespond(posts, res, next);
  } catch (error) {
    if (error.name === 'CastError') {
      return next(createError(404));
    }
    return next(createError(500, error));
  }
};

/**
 * Create a post.
 * Required: req.body.title and req.body.content
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const create = async (req, res, next) => {
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

  try {
    const savedPost = post.save().exec();
    return populateAndRespond(savedPost, res, next);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

/**
 *
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const update = (req, res, next) => {
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
        return populateAndRespond(post, res, next);
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
 * @param {*} next
 * @returns
 */
const destroy = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id })
    .then((post) => {
      return res.json({
        message: 'Deleted successfully',
      });
    })
    .catch((err) => {
      return next(createError(500, err));
    });
};

module.exports = {
  index,
  show,
  create,
  update,
  destroy,
};
