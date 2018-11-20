const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user.controller');

const jwtHelper = require('../config/jwtHelper');
/* GET users listing. */

router
  .route('/signup')
  .get(userCtrl.getSignup)
  .post(userCtrl.postSignup);

router
  .route('/login')
  .get(userCtrl.getLogin)
  .post(userCtrl.postLogin);

router
  .route('/account/profile')
  .get(jwtHelper.verifyJwtToken, userCtrl.getAccount)
  .post(jwtHelper.verifyJwtToken, userController.postUpdateProfile);

router
  .route('/account/password')
  // .get(jwtHelper.verifyJwtToken, userCtrl.getUpdatePassword)
  .post(jwtHelper.verifyJwtToken, userCtrl.postUpdatePassword);

router
  .route('/account/delete')
  // .get(jwtHelper.verifyJwtToken, userCtrl.getUpdatePassword)
  .post(jwtHelper.verifyJwtToken, userCtrl.postDeleteAccount);

router
  .route('/contact')
  .get(jwtHelper.verifyJwtToken, userCtrl.getContact)
  .post(jwtHelper.verifyJwtToken, userCtrl.postContact);

router
  .route('/forgot')
  .get(jwtHelper.verifyJwtToken, userCtrl.postForgot);
router
  .route('/userprofile')
  .get(jwtHelper.verifyJwtToken, userCtrl.userProfile);
 


module.exports = router;