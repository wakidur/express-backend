const express = require('express');
const router = express.Router();
const aboutCtrl = require('../controllers/aboutCtrl');
/* About pages */
router.get('/', aboutCtrl.about);

module.exports = router;