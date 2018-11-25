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
  .post(jwtHelper.verifyJwtToken, userCtrl.postUpdateProfile);

router
  .route('/account/password')
  .post(jwtHelper.verifyJwtToken, userCtrl.postUpdatePassword);

router
  .route('/account/delete')
  .post(jwtHelper.verifyJwtToken, userCtrl.postDeleteAccount);
  
router
  .route('/forgot')
  .get(jwtHelper.verifyJwtToken, userCtrl.getForgot)
  .post(jwtHelper.verifyJwtToken, userCtrl.postForgot);


 


module.exports = router;