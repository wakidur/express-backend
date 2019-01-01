const Joi = require('joi');
const Exercise = require('../model/exerciseSchema');

const ExercisePlan = require('../model/exercisePlanSchema');

const exerciseDS = require('../service/exerciseDataService');



// async function insert(req, res, next) {
//     const userSchema = Joi.object({
//         name: Joi.string().required(),
//         description: Joi.string().required(),
//         image: Joi.string().required(),
//         nameSound: Joi.string().required(),
//         procedure: Joi.string().required(),
//         videos: Joi.string().required(),
//     });



//     let user = await Joi.validate(req.body, userSchema, {
//         abortEarly: false
//     });
//     delete user.name;
//     let exercise = new Exercise(user);

//     exercise.save((err, location) => {
//         if (err) {
//             res
//                 .status(404)
//                 .json(err);
//         } else {
//             res
//                 .status(200)
//                 .json(location);
//         }
//     });
// }


exports.getExerciseCreate = (req, res, next) => {
    exerciseDS.getExerciseList().then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        handleError(res, err.message, "Failed to create new contact.");
    });
};

exports.postExerciseCreate = (req, res, next) => {
    // Create an Author object with escaped and trimmed data.

    const exerciseSchema = Joi.object({
        name: Joi.string().required(),
        title: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.string().required(),
        nameSound: Joi.string().required(),
        procedure: Joi.string().required(),
        videos: Joi.string().required(),
    });
    Joi.validate(req.body, exerciseSchema, (err, value) => {
        if (err) {
            res.status(201).json(err);
        } else {
            let exercise = new Exercise(value);
            exercise.save(function (err, result) {
                if (err) {
                    // next(err);;
                    handleError(res, err.message, "Failed to Save.");
                } else {
                    res.status(201).json(result);
                }
            });
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