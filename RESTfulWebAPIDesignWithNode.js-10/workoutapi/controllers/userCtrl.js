const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');
const Joi = require('joi');
const multer = require('multer');
const User = require('../model/userSchema');


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
      cb(null, new Date().toISOString() + file.originalname);
    }
  });
  
  const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
  }).single('userImage');

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
    upload(req, res, function (err) {
        
        if (err instanceof multer.MulterError) {
          // A Multer error occurred when uploading.
          console.log(err);
          res.status(201).json(err);
        } else if (err) {
          // An unknown error occurred when uploading.
          res.status(201).json(err);
        }
        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            fullname: req.body.fullname,
            email: req.body.email,
            password: req.body.password,
            userImage: req.file.path 
          });
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
      });











    // try {
    //     if (!req.body) {
    //         res.status(400).json({
    //             "message": "User content can not be empty"
    //         });
    //         return;
    //     }
    //     // Create a Exercise
    //     const userSchema = Joi.object({
    //         fullname: Joi.string().required(),
    //         email: Joi.string().email(),
    //         password: Joi.string().required(),
    //         // userImage: Joi.string().required(),
    //     });
    //     Joi.validate(req.body, userSchema, (err, value) => {
    //         if (err) {
    //             next(err);
    //         } else {
    //             User.findOne({
    //                 email: value.email
    //             }).then((result) => {
    //                 if (result) {
    //                     return res.status(200).json({
    //                         message: 'Account with that email address already exists.'
    //                     });
    //                 } else {
    //                     upload(req, res, function (err) {
    //                         if (err instanceof multer.MulterError) {
    //                           // A Multer error occurred when uploading.
    //                         } else if (err) {
    //                           // An unknown error occurred when uploading.
    //                         }
                         
    //                         const userObject = {
    //                             fullname: value.fullname,
    //                             email: value.email,
    //                             password: value.passport,
    //                             userImage: req.file.path,
    //                         }
    //                         let user = new User(userObject);
    //                         user.save().then((result) => {
    //                             res.status(200).json(result);
    //                         }).catch((err) => {
    //                             if (err.name === 'ValidationError') {
    //                                 var valErrors = [];
    //                                 Object.keys(err.errors).forEach((key) => {
    //                                     var b = {};
    //                                     b[key] = err.errors[key].message;
    //                                     valErrors.push(b);
    //                                 });
    //                                 return res.status(404).send(valErrors);
    //                             }
    //                             return res.status(404).json(err);
    //                         });
    //                       });

                        




    //                 }
    //             }).catch((err) => {
    //                 res.status(404).json(err);
    //             });
    //         }
    //     });
    // } catch (error) {
    //     res.json({
    //         "message": "block of code for errors!"
    //     });
    // }
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
                return res.status(200).json({ status: true, user : _.pick(user,['fullname','email']) });
        }
    );
};

/**
 * POST /account/profile
 * Update profile information.
 */

exports.postUserUpdateProfile = (req, res, next) => {}