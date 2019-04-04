const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('../model/userSchema');
const userDS = require('../service/userDataService');

/**
 * Sign in using Email and Password.
 */
passport.use(
    new localStrategy({
        usernameField: 'email'
    }, (username, password, done) => {
        User.findOne({
            email: username
        }, (err, user) => {
            if (err)
                return done(err);
            // unknown user
            else if (!user)
                return done(null, false, {
                    message: 'Email is not registered'
                });
            // wrong password
            else if (!user.verifyPassword(password))
                return done(null, false, {
                    message: 'Wrong password.'
                });
            // authentication succeeded
            else {
                userDS.getUserRoleById(user.id).then((result) => {
                    if (result.length === 0) {
                        return done(null, user);
                    } else {
                        const userrole = [];
                        if (result) {
                            if (result[0].role_id) {
                                for (const iterator of result[0].role_id) {
                                    userrole.push(iterator.name);
                                }
                                user.role = userrole;
                            }
                            return done(null, user);

                        } else {
                            return done(null, user);
                        }
                    }
                }).catch((err) => {
                    return done(null, false, {
                        message: err
                    });

                });
            }

        });
    })
);

module.exports = passport;