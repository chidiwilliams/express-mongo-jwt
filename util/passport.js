const mongoose = require('mongoose');
const passport = require('passport');
const passportLocal = require('passport-local');
const passportJWT = require('passport-jwt');
const User = require('../api/models/user');
const config = require('../config');

const LocalStrategy = passportLocal.Strategy;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

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
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.appSecret,
    },
    async (jwtPayload, cb) => {
      try {
        const user = User.findById(jwtPayload.id);
        return cb(null, user);
      } catch (error) {
        return cb(error);
      }
    }
  )
);
