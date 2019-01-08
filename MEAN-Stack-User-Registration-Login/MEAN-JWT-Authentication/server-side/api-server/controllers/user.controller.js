const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');
const User = require('../models/user.model');


/**
 * GET /signup
 * Signup page.
 */
exports.getSignup = (req, res, next) => {
    console.log(`user register controller get`);
    res
        .status(200)
        .json({
            token: "token"
        });
};

/**
 * POST /signup
 * Create a new local account.
 */
exports.postSignup = (req, res, next) => {
    if (!req.body.fullName || !req.body.email || !req.body.password) {
        res.status(400).json({
            "message": "All fields required"
        });
        return;
    }

    const user = new User({
        fullName: req.body.fullName,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role

    });
    User.findOne({
        email: req.body.email
    }, (err, existingUser) => {
        if (err) {
            res.status(404).json(err);
        }
        if (existingUser) {
            res.status(200).json({
                message: 'Account with that email address already exists.'
            });
            return;
        }
        user.save((err, data) => {
            if (err) {
                if (err.name === 'ValidationError') {
                    var valErrors = [];
                    Object.keys(err.errors).forEach((key) => {
                        var b = {};
                        b[key] = err.errors[key].message;
                        valErrors.push(b);
                    });
                    res.status(404).send(valErrors);
                }
                // res.status(404).json(err);
            } else {
                res.status(200).json(data);
            }
        });
    });

};

/**
 * GET /login
 * Login page.
 */
exports.getLogin = (req, res, next) => {
    console.log("get Authenticate User");
};

/**
 * POST /login
 * Sign in using email and password.
 */
exports.postLogin = (req, res, next) => {

    if (!req.body.email || !req.body.password) {
        res.status(400).json({
            "message": "All fields required"
        });
        return;
    }
    // call for passport authentication
    passport.authenticate('local', (err, user, info) => {
        // error from passport middleware
        if (err) return res.status(404).json(err);
        // registered user
        else if (user) return res.status(200).json({
            "token": user.generateJwt()
        });
        // unknown user or wrong password
        else return res.status(401).json(info);
    })(req, res);
};

/**
 * GET /account
 * Profile page.
 */
exports.getAccount = (req, res, next) => {
    User.findOne({
            _id: req._id
        },
        (err, user) => {
            if (err) {
                res.status(400).json(err);
                return;
            }
            if (!user)
                return res.status(404).json({
                    status: false,
                    message: 'User record not found.'
                });
            else
                return res.status(200).json({
                    status: true,
                    user: _.pick(user, ['fullName', 'email', 'role'])
                });
        }
    );
};

/**
 * POST /account/profile
 * Update profile information.
 */
exports.postUpdateProfile = (req, res, next) => {};

/**
 * POST /account/password
 * Update current password.
 */
exports.postUpdatePassword = (req, res, next) => {};


/**
 * POST /account/delete
 * Delete user account.
 */
exports.postDeleteAccount = (req, res, next) => {};

/**
 * GET /forgot
 * Forgot Password page.
 */
exports.getForgot = (req, res) => {}

/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 */
exports.postForgot = (req, res, next) => {}