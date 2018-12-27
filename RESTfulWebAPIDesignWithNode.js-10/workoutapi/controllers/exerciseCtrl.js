const Exercise = require('../model/exerciseSchema');
const ExercisePlan = require('../model/exercisePlanSchema');

const exerciseDS = require('../service/exerciseDataService');

exports.getExerciseCreate = (req, res, next) => {
    exerciseDS.getExerciseList().then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        handleError(res, err.message, "Failed to create new contact.");
    });
};

exports.postExerciseCreate = (req, res, next) => {
    // Create an Author object with escaped and trimmed data.
    let exercise = new Exercise({
        name: req.body.name,
        title: req.body.title,
        description: req.body.description,
        image: req.body.image,
        nameSound: req.body.nameSound,
        procedure: req.body.procedure,
        videos: req.body.videos,
    });
    exercise.save(function (err, result) {
        if (err) {
            // next(err);;
            handleError(res, err.message, "Failed to Save.");
        } else {
            res.status(201).json(result);
        }
    });
};


exports.exerciseReadOne = (req, res) => {
    /**
     * The try statement lets you test a block of code for errors.
     * The catch statement lets you handle the error.
     * The throw statement lets you create custom errors.
     */
    try {
        if (req.params && req.params.id) {
            exerciseDS.findById(req.params.id).then((result) => {
                if (!result) {
                    res.status(404).json({
                        "message": "exercise id not found"
                    });
                } else {
                    res.status(200).json(result);
                }
            }).catch((err) => {
                res.status(404).json(err);
            });
        } else {
            res.status(404).json({
                "message": "No id in request"
            });
        }
    } catch (error) {
        res.json({
            "message": "block of code for errors!"
        });
        // res.json(error);
    }
};

exports.exerciseUpdateOne = (req, res) => {};
exports.exerciseDeleteOne = (req, res) => {};

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({
        "error": message,
        "ERROR": reason
    });
}