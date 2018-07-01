const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../../config');

let userSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    email: { type: String, unique: true, required: true },
    updatedAt: { type: String, required: true },
    hash: String,
    salt: String,
  },
  {
    timestamps: true,
  }
);

userSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, 'sha512')
    .toString('hex');
};

userSchema.methods.checkPassword = function(password) {
  const inputHash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, 'sha512')
    .toString('hex');
  return this.hash === inputHash;
};

userSchema.methods.generateJWT = function() {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);
  const expTime = parseInt(expiry.getTime() / 1000);

  const secret = config.APP_SECRET;
  return jwt.sign(
    {
      name: this.name,
      email: this.email,
      exp: expTime,
    },
    secret
  );
};

userSchema.set('toJSON', {
  transform: (doc, ret, options) => {
    const retJson = {
      _id: ret._id,
      email: ret.email,
      name: ret.name,
      createdAt: ret.createdAt,
      updatedAt: ret.updatedAt,
    };
    return retJson;
  },
});

module.exports = mongoose.model('User', userSchema);
