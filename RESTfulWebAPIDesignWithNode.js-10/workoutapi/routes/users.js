var express = require('express');
var router = express.Router();

const  userCtrl = require('../controllers/userCtrl');
const jwtHelper = require('../config/jwtHelper');

/**
 * GET /signup
 * Signup page.
 * POST /signup
 * Create a new local account.
 */

// post request for creating a user.
router
    .route('/signup')
    .get(userCtrl.getSignup)
    .post(userCtrl.postSignup);

// post request for creating a authenticate.
router
    .route('/authenticate')
    .get(userCtrl.getLogin)
    .post(userCtrl.postLogin);

// post request for creating a authenticate.
router
    .route('/account')
    .get(jwtHelper.verifyJwtToken, userCtrl.getAllAccount);

router
    .route('/account/profile')
    .get(jwtHelper.verifyJwtToken, userCtrl.getUserProfile)
    .post(jwtHelper.verifyJwtToken, userCtrl.postUserUpdateProfile);

module.exports = router;
