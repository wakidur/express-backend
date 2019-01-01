// CONTACTS API ROUTES BELOW

/*  "/api/Exercise"
 *    GET: finds all Exercise
 *    POST: creates a new Exercise
 */
const asyncHandler = require('express-async-handler');
const express = require('express');
const router = express.Router();

let exerciseController = require('../controllers/exerciseCtrl');
let exercisePlanController = require('../controllers/exercisePlanCtrl');
let workoutPlanController = require('../controllers/workoutPlanCtrl');
/**
 * exercise Routes
 */

// GET request for creating a exercise.
router
    .route('/exercise/create')
    .get(exerciseController.getExerciseCreate)
    .post(exerciseController.postExerciseCreate);

router
    .route('/exercise/:id')
    .get(exerciseController.exerciseReadOne)
    .put(exerciseController.exerciseUpdateOne)
    .delete(exerciseController.exerciseDeleteOne);


// GET request for creating a exercise.
router
    .route('/exerciseplan/create')
    .get(exercisePlanController.getExercisePlanCreate)
    .post(exercisePlanController.postExercisePlanCreate);
// GET request for creating a WorkoutPlan.
router
    .route('/workoutplan/create')
    .get(workoutPlanController.getWorkoutPlanCreate)
    .post(workoutPlanController.postWorkoutPlanCreate);

module.exports = router;

