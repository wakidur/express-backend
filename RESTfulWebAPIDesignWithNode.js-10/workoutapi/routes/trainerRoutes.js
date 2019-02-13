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
let durationsController = require('../controllers/durationsCtrl');
let workoutLogEntryCtrlController = require('../controllers/workoutLogEntryCtrl');
/**
 * exercise Routes
 */

// GET request for creating a exercise.
router
    .route('/exercise/create')
    .get(asyncHandler(exerciseController.getAllExercise))
    .post(asyncHandler(exerciseController.createExercise));

router
    .route('/exercise/:id')
    .get(exerciseController.exerciseReadByName)
    .put(exerciseController.exerciseUpdateById)
    .delete(exerciseController.exerciseDeleteById);


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

router
    .route('/workoutplan/:id')
    .get(workoutPlanController.workoutPlanReadByName)
    .put(workoutPlanController.workoutPlanUpdateById)
    .delete(workoutPlanController.workoutPlanDeleteById);

// duration
router
    .route('/duration')
    .get(durationsController.getAllDurations);

router
    .route('/duration/create')
    .post(durationsController.createDuration);

// workoutLogEntry
router
    .route('/workoutLogEntry')
    .get(workoutLogEntryCtrlController.getAllWorkoutLogEntry);

router
    .route('/workoutLogEntry/create')
    .post(workoutLogEntryCtrlController.createWorkoutLogEntry);
    
    router
    .route('/workoutLogEntry/:id')
    .get(workoutLogEntryCtrlController.workoutLogEntryReadById)
    .put(workoutLogEntryCtrlController.workoutLogEntryUpdateById)
    .delete(workoutLogEntryCtrlController.workoutLogEntryDeleteById);

module.exports = router;

