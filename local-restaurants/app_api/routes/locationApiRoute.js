const express = require('express');
const router = express.Router();
const locationsCtrl = require('../controllers/locationApiCtrl');


// locations
router
  .route('/locations')
  .get(locationsCtrl.locationsListByDistance)
  .post(locationsCtrl.locationsCreate);

router
  .route('/locations/:locationid')
  .get(locationsCtrl.locationsReadOne)
  
 

module.exports = router;
