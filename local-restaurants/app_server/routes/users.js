var express = require('express');
var router = express.Router();
const userCtrl = require('../controllers/usersCtrl');

/* GET users listing. */
router.get('/', userCtrl.users);

module.exports = router;
