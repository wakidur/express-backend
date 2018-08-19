const express = require('express');
const router = express.Router();
const locationsCtrl = require('../controllers/locationApiCtrl');
const reviewsCtrl = require('../controllers/reviewsApiCtrl');


// locations
router
  .route('/locations')
  .get(locationsCtrl.locationsListByDistance)
  .post(locationsCtrl.locationsCreate);

router
  .route('/locations/:locationid')
  .get(locationsCtrl.locationsReadOne)
  .put(locationsCtrl.locationsUpdateOne)
  .delete(locationsCtrl.locationsDeleteOne);

// reviews 
router
  .route('/locations/:locationid/reviews')
  .post(reviewsCtrl.reviewsCreate);

router
  .route('/locations/:locationid/reviews/:reviewid')
  .get(reviewsCtrl.reviewsReadOne)
  .put(reviewsCtrl.reviewsUpdateOne)
  .delete(reviewsCtrl.reviewsDeleteOne);



module.exports = router;