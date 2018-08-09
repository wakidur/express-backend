const express = require('express');
const router = express.Router();
const locationCtrl = require('../controllers/locationsCtrl');


/* Locations pages */
router.get('/', locationCtrl.homelist);
router.get('/location/:locationid', locationCtrl.locationInfo);
router
  .route('/location/:locationid/review/new')
  .get(locationCtrl.addReview)
  .post(locationCtrl.doAddReview);
module.exports = router;
