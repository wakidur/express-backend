const express = require('express');
const router = express.Router();
const locationCtrl = require('../controllers/locationsCtrl');


/* Locations pages */
router.get('/', locationCtrl.homelist);

module.exports = router;
