const Exercise = require('../model/exerciseSchema');
const ExercisePlan = require('../model/exercisePlanSchema');
const WorkoutPlan = require('../model/workoutPlanSchema');

const workoutPlanDS = require('../service/workoutPlanDataService');

exports.getWorkoutPlanCreate = (req, res, next) => {
    workoutPlanDS.getWorkoutPlanList().then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        // handleError(res, err.message, "Failed to create new contact.");
        return next(err);
    });
};

exports.postWorkoutPlanCreate = (req, res, next) => {
    // Create an Author object with escaped and trimmed data.
    let workoutPlan = new WorkoutPlan({
        name: req.body.name,
        title: req.body.title,
        restBetweenExercise: req.body.restBetweenExercise,
        exercises: req.body.exercises,
        description: req.body.description,       
    });
    workoutPlan.save(function (err, result) {
        if (err) {
            // next(err);
            handleError(res, err.message, "Failed to Save.");
        } else {
            res.status(201).json(result);
        }
    });
};


// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({"error": message, "ERROR": reason});
  }
