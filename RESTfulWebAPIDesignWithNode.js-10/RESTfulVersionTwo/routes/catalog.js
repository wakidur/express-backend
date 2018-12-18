const express = require('express');
const catalogCtrl = require('../controller/catalogCtrl');

const router = express.Router();

router
    .route('/')
    .get(catalogCtrl.getAllCategoryies);

module.exports = router;