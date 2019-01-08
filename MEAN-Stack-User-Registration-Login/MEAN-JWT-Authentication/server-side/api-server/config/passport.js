const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const mongoose = require('mongoose');
const User = require('../models/user.model');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

/**
 * Sign in using Email and Password.
 */
passport.use(
  new LocalStrategy({ usernameField: 'email' }, (username, password, done) => {
      User.findOne({ email: username }, (err, user) => {
          if (err)
            return done(err);
          // unknown user
          else if (!user)
            return done(null, false, {
              message: `Email ${email} not found.`
            });
          // wrong password
          else if (!user.verifyPassword(password))
            return done(null, false, {
              message: 'Wrong password.'
            });
          // authentication succeeded
          else
            return done(null, user);
        });
    })
);