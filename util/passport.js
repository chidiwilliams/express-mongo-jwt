const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const User = require('../api/models/user');
const config = require('../config');
const debug = require('debug')('express-mongo-jwt:passport');

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
    },
    (username, password, done) => {
      const user = User.findOne({ email: username }, (err, user) => {
        if (err) {
          return done(error);
        }

        if (!user) {
          return done(null, false, {
            message: 'Incorrect email address',
          });
        }

        if (!user.checkPassword(password)) {
          return done(null, false, {
            message: 'Incorrect password',
          });
        }

        return done(null, user);
      });
    }
  )
);

passport.use(
  new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.APP_SECRET,
  }, (jwtPayload, done) => {
    const user = User.findById(jwtPayload._id, (err, user) => {
      if (err) {
        return done(err);
      }
      return done(null, user);
    });
  })
);
