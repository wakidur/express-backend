var express = require('express');
var router = express.Router();

const userCtrl = require('../controllers/home.controller');
/* GET users listing. */

router
  .route('/')
  .get(userCtrl.homePage);


module.exports = router;