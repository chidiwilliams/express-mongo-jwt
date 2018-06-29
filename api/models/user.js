const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../../config');

let userSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    email: { type: String, unique: true, required: true },
    name: { type: String, required: true },
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
  expiry.setDate(expiry.getDate + 7);

  const secret = config.appSecret;
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
      exp: parseInt(expiry.getTime() / 1000),
    },
    secret
  );
};

module.exports = mongoose.model('User', userSchema);
