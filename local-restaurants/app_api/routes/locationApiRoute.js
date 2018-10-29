const express = require('express');
const router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'payload'
});
const locationsCtrl = require('../controllers/locationApiCtrl');
const reviewsCtrl = require('../controllers/reviewsApiCtrl');
const ctrlAuth = require('../controllers/authentication');


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
  .post(auth, reviewsCtrl.reviewsCreate);

router
  .route('/locations/:locationid/reviews/:reviewid')
  .get(reviewsCtrl.reviewsReadOne)
  .put(auth, reviewsCtrl.reviewsUpdateOne)
  .delete(auth, reviewsCtrl.reviewsDeleteOne);

// authentication
router
  .route('/register')
  .post(ctrlAuth.register);
router
  .route('/login')
  .post(ctrlAuth.login);


module.exports = router;