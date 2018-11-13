var express = require('express');
var router = express.Router();

const userCtrl = require('../controllers/user.controller');
/* GET users listing. */

router
  .route('/register')
  .get(userCtrl.getRegister)
  .post(userCtrl.postRegister);


module.exports = router;