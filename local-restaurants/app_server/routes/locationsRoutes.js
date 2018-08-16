const express = require('express');
const router = express.Router();
const locationCtrl = require('../controllers/locationsCtrl');


/* Locations pages */
router
    .route('/')
    .get(locationCtrl.homeList);
   
router.get('/location/:locationid', locationCtrl.locationInfo);




module.exports = router;