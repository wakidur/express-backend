const express = require('express');
const router = express.Router();
const locationCtrl = require('../controllers/locationsCtrl');


/* GET home page. */
router.get('/', locationCtrl.homelist);
router.get('/location', locationCtrl.locationInfo);
router.get('/location/review/new', locationCtrl.addReview);

module.exports = router;
