const mongoose = require('mongoose');
const debug = require('debug')('express-mongo-jwt:postmodel');

const postSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true,
    },
    title: {
      type: 'String',
      required: true,
    },
    content: {
      type: 'String',
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

postSchema.set('toJSON', {
  transform: (doc, ret, options) => {
    const retJson = {
      _id: ret._id,
      title: ret.title,
      content: ret.content,
      author: ret.author,
      createdAt: ret.createdAt,
      updatedAt: ret.updatedAt,
    };
    return retJson;
  },
});

const populateFields = function(next) {
  this.populate('author');
  next();
};

postSchema.pre('find', populateFields).pre('findOne', populateFields);

module.exports = mongoose.model('Post', postSchema);
