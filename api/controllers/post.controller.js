const Post = require('../models/post');
const createError = require('http-errors');

/**
 * Populates the Post object before sending response
 *
 * @param {*} posts
 * @param {*} res
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
    return res.status(200).json({ posts });
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
    return res.status(200).json({ post });
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
    return next(createError(403, 'Please enter all required fields'));
  }

  const post = new Post();
  post.title = req.body.title;
  post.content = req.body.content;
  // Generate random ID for the post
  post.author = req.user._id;

  try {
    const savedPost = await post.save();
    return populateAndRespond(savedPost, res, next);
  } catch (error) {
    return next(createError(500, error));
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
const update = async (req, res, next) => {
  if (!req.body.title || !req.body.content) {
    return next(createError(403, 'Please enter all required fields'));
  }

  try {
    const post = await Post.findById(req.params.id).exec();
    post.title = req.body.title;
    post.content = req.body.content;

    const savedPost = await post.save();
    return populateAndRespond(savedPost, res, next);
  } catch (error) {
    return next(createError(500, error));
  }
};

/**
 * Delete a post by id in req.params.id
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const destroy = async (req, res, next) => {
  try {
    await Post.findByIdAndRemove(req.params.id).exec();
    return res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    return next(createError(500, err));
  }
};

module.exports = {
  index,
  show,
  create,
  update,
  destroy,
};
