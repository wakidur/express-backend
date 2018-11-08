const express = require('express');
const router = express.Router();
const jwt = require('express-jwt');
const isAuthenticated = jwt({
  secret: 'helloWorld',
  // secret: new Buffer('helloWorld', 'base64'),
  // audience: 'http://myapi/protected',
  // issuer: 'http://issuer',
  userProperty: 'payload',
  // requestProperty: 'auth',
  // resultProperty: 'locals.user'
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
  .post(isAuthenticated, reviewsCtrl.reviewsCreate);

router
  .route('/locations/:locationid/reviews/:reviewid')
  .get(reviewsCtrl.reviewsReadOne)
  .put(isAuthenticated, reviewsCtrl.reviewsUpdateOne)
  .delete(isAuthenticated, reviewsCtrl.reviewsDeleteOne);

// authentication
router
  .route('/register')
  .post(ctrlAuth.register);
router
  .route('/login')
  .post(ctrlAuth.login);


module.exports = router;