const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userCtrl');
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
  .post(userCtrl.postSignup);


// post request for creating a authenticate.
router
  .route('/login')
  .post(userCtrl.postLogin);

router
  .route('/forgot')
  .post(userCtrl.postForgot);


// Get all user account.
router
  .route('/account')
  .get(jwtHelper.verifyJwtToken, userCtrl.getAllAccount);

router
  .route('/account/profile')
  .get(jwtHelper.verifyJwtToken, userCtrl.getUserProfile)
  .post(jwtHelper.verifyJwtToken, userCtrl.postUpdateProfile);

router
  .route('/account/password')
  .post(jwtHelper.verifyJwtToken, userCtrl.postUpdatePassword);

router
  .route('/account/delete')
  .post( jwtHelper.verifyJwtToken, userCtrl.postDeleteAccount);


/******* Account Management **********/
// List Of Roles
router
  .route('/list-of-roles')
  .get(userCtrl.getListOfRoles)
  .post(userCtrl.postListOfRoles)
  .put(userCtrl.updateListOfRoles);

// List Of Resource Or Action
router
  .route('/list-of-resources')
  .get(userCtrl.getListOfResourceOrAction)
  .post(userCtrl.postListOfResourceOrAction);

// User Roles
router
  .route('/user-roles')
  .get(userCtrl.getUserRoles)
  .post(userCtrl.postUserRoles);

router
  .route('/user-roles/:id')
  .get(userCtrl.getUserRoleById)
  .put(userCtrl.userRoleUpdateById)
  .delete(userCtrl.userRoleDeleteById);

// role Wise Resource Permission
router
  .route('/role-wise-resource-permission')
  .get(userCtrl.getRoleWiseResourcePermission)
  .post(userCtrl.postRoleWiseResourcePermission);

module.exports = router;