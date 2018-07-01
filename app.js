const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
require('./util/mongoose');
require('./util/passport');
const userRouter = require('./api/routes/user.routes');
const postRouter = require('./api/routes/post.routes');
const authRouter = require('./api/routes/auth.routes');
const config = require('./config');
const debug = require('debug')('express-mongo-jwt:app');
const createError = require('http-errors');

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

app.use('/api', userRouter);
app.use('/api', authRouter);
app.use('/api', postRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? err.message : err.stack,
  });
});

// Start server and listen on config.port
app.listen(config.PORT, () => {
  debug('Listening on ' + config.PORT);
});

module.exports = app;
