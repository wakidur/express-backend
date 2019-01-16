const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');
const Joi = require('joi');
const User = require('../model/userSchema');
/**
 * GET /signup
 * Signup page.
 */
exports.getSignup = (req, res) => {
    if (req.user) {
        return res.redirect('/');
    }
    res.status(200).json({
        title: 'Create Account'
    });
};

/**
 * POST /signup
 * Create a new local account.
 */
exports.postSignup = (req, res, next) => {
    try {
        if (!req.body) {
            res.status(400).json({
                "message": "User content can not be empty"
            });
            return;
        }
        // Create a Exercise
        const userSchema = Joi.object({
            fullname: Joi.string().required(),
            email: Joi.string().email(),
            password: Joi.string().required(),
        });
        Joi.validate(req.body, userSchema, (err, value) => {
            if (err) {
                next(err);
            } else {
                User.findOne({
                    email: value.email
                }).then((result) => {
                    if (result) {
                        return res.status(200).json({
                            message: 'Account with that email address already exists.'
                        });
                    } else {
                        let user = new User(value);
                        user.save().then((result) => {
                            res.status(200).json(result);
                        }).catch((err) => {
                            if (err.name === 'ValidationError') {
                                var valErrors = [];
                                Object.keys(err.errors).forEach((key) => {
                                    var b = {};
                                    b[key] = err.errors[key].message;
                                    valErrors.push(b);
                                });
                                return res.status(404).send(valErrors);
                            }
                            return res.status(404).json(err);
                        });
                    }
                }).catch((err) => {
                    res.status(404).json(err);
                });
            }
        });
    } catch (error) {
        res.json({
            "message": "block of code for errors!"
        });
    }
};


/**
 * GET /login
 * Login page.
 */
exports.getLogin = (req, res) => {
    if (req.user) {
        return res.redirect('/');
    }
    res.status(200).json({
        title: 'Login'
    });
};

/**
 * POST /login
 * Sign in using email and password.
 */
exports.postLogin = (req, res, next) => {
    try {
        if (!req.body) {
            return res.status(400).json({
                "message": "Email is not valid and Password cannot be blank"
            });
        } else {
            const userSchema = Joi.object({
                email: Joi.string().email(),
                password: Joi.string().required(),
            });
            Joi.validate(req.body, userSchema, (err, value) => {
                if (err) {
                    return res.status(404).json(err);
                } else {
                    // call for passport authentication
                    passport.authenticate('local', (err, user, info) => {
                        // error from passport middleware
                        if (err) {
                            return res.status(400).json(err);
                        } else if (user) {
                            // registered user
                            return res.status(200).json({
                                "token": user.generateJwt()
                            });
                        } else {
                            // unknown user or wrong password
                            return res.status(404).json(info);
                        }
                    })(req, res);
                }
            });
        }

    } catch (error) {
        res.json({
            "message": "block of code for errors!"
        });
    }

};

/**
 * GET /account
 * get All Account.
 */
exports.getAllAccount = (req, res) => { };



/**
 * GET /account/profile
 * Profile page.
 */


exports.getUserProfile = (req, res, next) => {
    User.findOne({ _id: req._id },
        (err, user) => {
            if (!user)
                return res.status(404).json({ status: false, message: 'User record not found.' });
            else
                return res.status(200).json({ status: true, user : _.pick(user,['fullName','email']) });
        }
    );
};

/**
 * POST /account/profile
 * Update profile information.
 */

exports.postUserUpdateProfile = (req, res, next) => {}