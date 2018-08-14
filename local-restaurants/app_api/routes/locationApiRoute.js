const express = require('express');
const router = express.Router();
const locationsCtrl = require('../controllers/locationApiCtrl');


// locations
router
  .route('/locations')
  .get(locationsCtrl.locationsListByDistance);
  
 

module.exports = router;
