const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const debug = require('debug')('express-mongo-jwt:app');
const cors = require('cors');
require('./util/passport');
const userRouter = require('./api/routes/user.routes');
const postRouter = require('./api/routes/post.routes');
const authRouter = require('./api/routes/auth.routes');
const config = require('./config');

const app = express();

mongoose.Promise = global.Promise;

// MongoDB Connection
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(
    config.mongoURL,
    (err) => {
      if (err) {
        debug('Please make sure Mongodb is installed and running!'); // eslint-disable-line no-console
        throw err;
      }
    }
  );
}

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', userRouter);
app.use('/api', authRouter);
app.use('/api', postRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500).json({ message: 'Error.' });
});

module.exports = app;
