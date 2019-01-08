let express = require('express');
let router = express.Router();

// Require controller modules.
let applicationCtrl = require('../controllers/applicationController');





//calling api based method
router.get('/getApplication', applicationCtrl.getApplication);


module.exports = router;