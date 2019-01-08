const express = require('express');
const catalogCtrl = require('../controller/catalogCtrl');

const router = express.Router();

router
    .route('/')
    .get(catalogCtrl.getAllCategoryies);
router
    .route('/:categoryId')
    .get(catalogCtrl.findItems);
router
    .route('/:categoryId/:itemId')
    .get(catalogCtrl.findItem);

router
    .route('/create')
    .post(catalogCtrl.createItem);
// router.post('/',catalogCtrl.createItem);

module.exports = router;