const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = require('../api/models/user');
const passportJWT = require('passport-jwt');
const config = require('../config');

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
    },
    function(username, password, done) {
      User.findOne(
        {
          email: username,
        },
        function(err, user) {
          if (err) {
            return done(err);
          }

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
        }
      );
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.appSecret,
    },
    (jwtPayload, cb) => {
      return User.findById(jwtPayload.id)
        .then((user) => {
          return cb(null, user);
        })
        .catch((err) => {
          return cb(err);
        });
    }
  )
);
