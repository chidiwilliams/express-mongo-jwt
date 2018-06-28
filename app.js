const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const debug = require('debug')('express-mongo-jwt:app');
const cors = require('cors');
const indexRouter = require('./api/routes/index');
const usersRouter = require('./api/routes/users');
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

app.use('/api', indexRouter);
app.use('/api/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.status(404).json({ message: 'Not found' });
});

module.exports = app;
