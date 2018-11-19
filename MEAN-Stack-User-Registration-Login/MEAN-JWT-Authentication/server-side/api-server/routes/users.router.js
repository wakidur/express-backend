var express = require('express');
var router = express.Router();

const userCtrl = require('../controllers/user.controller');

const jwtHelper = require('../config/jwtHelper');
/* GET users listing. */

router
  .route('/register')
  .get(userCtrl.getRegister)
  .post(userCtrl.postRegister);

router
  .route('/authenticate')
  .get(userCtrl.getAuthenticateUser)
  .post(userCtrl.postAuthenticateUser);

  router
  .route('/userprofile')
  .get(jwtHelper.verifyJwtToken, userCtrl.userProfile);
 


module.exports = router;