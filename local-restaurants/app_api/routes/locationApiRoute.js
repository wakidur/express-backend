const express = require('express');
const router = express.Router();
const jwt = require('express-jwt');
const secret = process.env.JWT_SECRET
const auth = jwt({
  secret: 'secret',
  userProperty: 'payload'
});
const locationsCtrl = require('../controllers/locationApiCtrl');
const reviewsCtrl = require('../controllers/reviewsApiCtrl');
const authCtrl = require('../controllers/authentication');


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
  .post(authCtrl.register);
router
  .route('/login')
  .post(authCtrl.login);


module.exports = router;