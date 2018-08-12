const express = require('express');
const router = express.Router();
const ctrlLocations = require('../controllers/locationApiCtrl');


// locations
router
  .route('/locations')
  .get(ctrlLocations.locationsListByDistance);
 

module.exports = router;
