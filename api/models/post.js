const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
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
});

postSchema.set('toJSON', {
  transform: (doc, ret, options) => {
    const retJson = {
      _id: ret._id,
      title: ret.title,
      content: ret.content,
      author: ret.author,
    };
    return retJson;
  },
});

module.exports = mongoose.model('Post', postSchema);
