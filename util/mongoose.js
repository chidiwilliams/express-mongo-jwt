const mongoose = require('mongoose');
const debug = require('debug')('express-mongo-jwt:mongoose');
const config = require('../config');

mongoose.Promise = global.Promise;

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(config.mongoURL).catch((err) => {
    debug('Please make sure Mongodb is installed and running!');
    process.exit(1);
  });
}

mongoose.connection.on('connected', function() {
  debug('Mongoose connected to ' + config.mongoURL);
});

mongoose.connection.on('error', function(err) {
  debug('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function() {
  debug('Mongoose disconnected');
});

const gracefulShutdown = function(msg, callback) {
  mongoose.connection.close(function() {
    debug('Mongoose disconnected through ' + msg);
    callback();
  });
};

process.once('SIGUSR2', function() {
  gracefulShutdown('nodemon restart', function() {
    process.kill(process.pid, 'SIGUSR2');
  });
});

process.on('SIGINT', function() {
  gracefulShutdown('app termination', function() {
    process.exit(0);
  });
});

process.on('SIGTERM', function() {
  gracefulShutdown('Heroku app termination', function() {
    process.exit(0);
  });
});
