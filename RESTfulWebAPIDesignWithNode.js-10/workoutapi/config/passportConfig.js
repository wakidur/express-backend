const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('../model/userSchema');
const userDS = require('../service/userDataService');

passport.use(
    new localStrategy({
            usernameField: 'email'
        },
        (username, password, done) => {
            User.findOne({
                    email: username
                },
                (err, user) => {
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
                        return done(null, user);
                        // userDS.getUserRoleById(user.id).then((result) => {
                        //     if (result) {
                        //         if (result.role_id) {
                        //             result.rold_id.forEach(element => {
                        //                 console.log(element);
                                        
                        //             });
                        //         }
                               
                        //     } else {
                                
                        //     }
                        // }).catch((err) => {
                            
                        // });
                        
                    }
                        
                });
        })
);

module.exports = passport;