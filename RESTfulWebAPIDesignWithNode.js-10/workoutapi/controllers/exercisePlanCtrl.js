const Exercise = require('../model/exerciseSchema');
const ExercisePlan = require('../model/exercisePlanSchema');

exports.getExercisePlanCreate = (req, res, next) => {
    ExercisePlan.find().then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        handleError(res, err.message, "Failed to create new contact.");
    });
};

exports.postExercisePlanCreate = (req, res, next) => {
    // Create an Author object with escaped and trimmed data.
    let exercisePlan = new ExercisePlan({
        exercise: req.body.exercise,
        duration: req.body.duration,
               
    });
    exercisePlan.save(function (err, result) {
        if (err) {
            // next(err);;
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
