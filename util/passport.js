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
    async (email, password, done) => {
      try {
        user = await User.findOne({ email: username });
        if (!user) {
          return done(null, false, {
            message: 'User not found',
          });
        }
        if (!user.checkPassword(password)) {
          return done(null, false, {
            message: 'Invalid password',
          });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
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
