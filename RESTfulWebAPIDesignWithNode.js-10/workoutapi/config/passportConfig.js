const passport = require('passport');
const localStrategy  = require('passport-local').Strategy;
const User  = require('../model/userSchema');

passport.use(new localStrategy({usernameField: 'email'}, (username, password, done) => {
        User.findOne({email: username }, (err, user) => {
            if (err) {
                return done(err);
            } else if ( !user ){
                // unknown user
                return done(null, false, { message: 'Email is not registered' });
            } else if (!user.verifyPassword(password)) {
                // wrong password
                return done(null, false, { message: 'Wrong password.' });
            } else {
                // authentication succeeded
                return done(null, user);
            }
        });
    })
);


