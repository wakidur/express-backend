const Exercise = require('../model/exerciseSchema');
const ExercisePlan = require('../model/exercisePlanSchema');

exports.getExerciseCreate = (req, res, next) => {
    Exercise.find().then((result) => {
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


// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({"error": message, "ERROR": reason});
  }
