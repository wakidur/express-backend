const Exercise = require('../model/exerciseSchema');
const ExercisePlan = require('../model/exercisePlanSchema');
const WorkoutPlan = require('../model/workoutPlanSchema');

const workoutPlanDS = require('../service/workoutPlanDataService');
const exerciseDS = require('../service/exerciseDataService');

exports.getWorkoutPlanCreate = (req, res, next) => {
    workoutPlanDS.getWorkoutPlanList().then((result) => {
        console.log(result);
        res.status(200).json(result);
    }).catch((err) => {
        // handleError(res, err.message, "Failed to create new contact.");
        return next(err);
    });
};

exports.postWorkoutPlanCreate = (req, res, next) => {
    // Create an workoutPlan object with escaped and trimmed data.

    const workoutPlan = new WorkoutPlan({
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

// find each exercise with a name matching 'Ghost', selecting the `name` and `occupation` fields
exports.workoutPlanReadByName = (req, res) => {
    /**
     * The try statement lets you test a block of code for errors.
     * The catch statement lets you handle the error.
     * The throw statement lets you create custom errors.
     */
    try {
        if (req.params && req.params.id) {
            const queryName = req.params.id;
            // WorkoutPlan.findOne({name: queryName}).populate('exercises.exercise')
            WorkoutPlan.findOne({name: queryName}).then((result) => {
                if (!result) {
                    res.status(404).json({
                        "message": "Exercise id not found"
                    });
                    return;
                } else {
                    res.status(200).json(result);
                }
            }).catch((err) => {
                res.status(500).json({
                    "message": "Something wrong retrieving product with id "
                });
            });
        } else {
            res.status(404).json({
                "message": "No Exercise id in request"
            });
        }
    } catch (error) {
        res.json({
            "message": "block of code for errors!"
        });
        // res.json(error);
    }
};

exports.workoutPlanReadByForkJoin = (req, res) => {
    /**
     * The try statement lets you test a block of code for errors.
     * The catch statement lets you handle the error.
     * The throw statement lets you create custom errors.
     */
    try {
        if (req.params && req.params.id) {
            const queryName = req.params.id;
            // WorkoutPlan.findOne({name: queryName}).populate('exercises.exercise')
            Promise.all([workoutPlanDS.getWorkoutPlanByName(queryName),exerciseDS.getExerciseForkJoin()])
            .then((result) => {
                if (!result) {
                    res.status(404).json({
                        "message": "Exercise id not found"
                    });
                    return;
                } else {
                    res.status(200).json(result);
                }
            }).catch((err) => {
                res.status(500).json({
                    "message": "Something wrong retrieving product with id "
                });
            });
        } else {
            res.status(404).json({
                "message": "No Exercise id in request"
            });
        }
    } catch (error) {
        res.json({
            "message": "block of code for errors!"
        });
        // res.json(error);
    }
};

// Update a exercise
exports.workoutPlanUpdateById = async function(req, res, next) {
    try {
        if (req.params && req.params.id) {
            const queryName = req.params.id;
            workoutPlanDS.getWorkoutPlanById(queryName).then((result) => {
                if (!result) {
                    res.status(404).json({
                        "message": "Exercise id not found"
                    });
                    return;
                } else {
                    res.status(200).json(result);
                }
            }).catch((err) => {
                res.status(500).json({
                    "message": "Something wrong retrieving product with id "
                });
            });
        } else {
            res.status(404).json({
                "message": "No Exercise id in request"
            });
        }

    } catch (error) {
        res.json({
            "message": "block of code for errors!"
        });
    }
}


// Delete a note with the specified noteId in the request
exports.workoutPlanDeleteById = (req, res, next) => {
    try {

    } catch (error) {

    }

};
// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({
        "error": message,
        "ERROR": reason
    });
}