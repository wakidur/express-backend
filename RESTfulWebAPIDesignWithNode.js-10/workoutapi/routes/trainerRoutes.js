// CONTACTS API ROUTES BELOW

/*  "/api/Exercise"
 *    GET: finds all Exercise
 *    POST: creates a new Exercise
 */

const express = require('express');
const router = express.Router();

let exerciseController = require('../controllers/exerciseCtrl');
let exercisePlanController = require('../controllers/exercisePlanCtrl');
/**
 * exercise Routes
 */

// GET request for creating a exercise.
router
    .route('/exercise/create')
    .get(exerciseController.getExerciseCreate)
    .post(exerciseController.postExerciseCreate);


// GET request for creating a exercise.
router
    .route('/exerciseplan/create')
    .get(exercisePlanController.getExercisePlanCreate)
    .post(exercisePlanController.postExercisePlanCreate);

module.exports = router;

