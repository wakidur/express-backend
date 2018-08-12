const express = require('express');
const router = express.Router();
const locationCtrl = require('../controllers/locationsCtrl');


/* Locations pages */
router.get('/', locationCtrl.homeList);



module.exports = router;
