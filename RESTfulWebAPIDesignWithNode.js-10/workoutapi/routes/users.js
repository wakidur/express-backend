const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const path = require('path');
const userCtrl = require('../controllers/userCtrl');
const jwtHelper = require('../config/jwtHelper');
const Joi = require('joi');
const multer = require('multer');
const User = require('../model/userSchema');

const storage = multer.diskStorage({
  destination: function (req, file, next) {
    next(null, path.join(__dirname, '../uploads/'));
  },
  filename: function (req, file, next) {
    const now = new Date().toISOString();
    const date = now.replace(/:/g, '-');
    next(null, date + file.originalname);
  }
});



// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads');
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now());
//   }
// })

// var upload = multer({ storage: storage });

// const fileFilter = (req, file, cb) => {
//   // reject a file
//   if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };

const upload = multer({
  storage: storage,
});





/**
 * GET /signup
 * Signup page.
 * POST /signup
 * Create a new local account.
 */

// post request for creating a user.
router
  .route('/signup')
  .get(userCtrl.getSignup);
// .post(userCtrl.postSignup);


// post request for creating a authenticate.
router
  .route('/login')
  .get(userCtrl.getLogin)
  .post(userCtrl.postLogin);

// post request for creating a authenticate.
router
  .route('/account')
  .get(jwtHelper.verifyJwtToken, userCtrl.getAllAccount);

router
  .route('/account/profile')
  .get(jwtHelper.verifyJwtToken, userCtrl.getUserProfile)
  .post(jwtHelper.verifyJwtToken, userCtrl.postUserUpdateProfile);


router.route("/signup").post(
  upload.single('userImage'), (req, res, next) => {
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
              if (req.file) {
                var user = new User({
                  fullname: value.fullname,
                  email: value.email,
                  password: value.password,
                  userImage: req.file.filename,
                });
              } else {
                var user = new User({
                  fullname: value.fullname,
                  email: value.email,
                  password: value.password,
                });
              }
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
            return res.status(404).json(err);
          });
        }
      });
    } catch (error) {
      res.json({
        "message": "block of code for errors!"
      });
    }
  });

module.exports = router;