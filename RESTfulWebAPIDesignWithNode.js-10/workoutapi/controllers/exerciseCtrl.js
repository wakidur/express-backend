const Joi = require('joi');
const Exercise = require('../model/exerciseSchema');

const ExercisePlan = require('../model/exercisePlanSchema');

const exerciseDS = require('../service/exerciseDataService');

// Retrieve all Exercise from the database.
exports.getAllExercise = (req, res, next) => {
    try {
        exerciseDS.getExerciseList().then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            handleError(res, err.message, "Something wrong while retrieving exercise.");
        });
    } catch (error) {
        res.json(error);
    }

};

//Create new Exercise
exports.createExercise = (req, res, next) => {
    try {
        if (!req.body) {
            res.status(400).json({
                "message": "Exercise content can not be empty"
            });
            return;
        }
        // Create a Exercise
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
                exerciseDS.saveExercise(value).then((result) => {
                    res.status(201).json(result);
                }).catch((err) => {
                    next(err);
                    handleError(res, err.message, "Something wrong while creating the Exercise.");
                });
            }
        });
    } catch (error) {
        res.json({
            "message": "block of code for errors!"
        });
    }
};

// Find a single Exercise with a exercise Id
exports.exerciseReadById = (req, res) => {
    /**
     * The try statement lets you test a block of code for errors.
     * The catch statement lets you handle the error.
     * The throw statement lets you create custom errors.
     */
    try {
        if (req.params && req.params.id) {
            exerciseDS.exerciseReadById(req.params.id).then((result) => {
                if (!result) {
                    res.status(404).json({
                        "message": "Exercise id not found"
                    });
                    return;
                } else {
                    res.status(200).json(result);
                }
            }).catch((err) => {
                if (err.kind === "ObjectId") {
                    res.status(404).json({
                        "message": "Exercise not found"
                    });
                }
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
exports.exerciseUpdateById = (req, res, next) => {
    try {

        if (!req.params.id) {
            res.status(value).json({
                "message": "Not found, Exercise id is required"
            });
            return;
        } else {
            exerciseDS.exerciseUpdateById(req.params.id).then((result) => {
                if (!result) {
                    res.status(404).json({
                        "message": "Exercise id not found"
                    });
                    return;
                } else {
                    const exerciseSchema = Joi.object({
                        name: Joi.string().required(),
                        title: Joi.string().required(),
                        description: Joi.string().required(),
                        image: Joi.string().required(),
                        nameSound: Joi.string().required(),
                        procedure: Joi.string().required(),
                        videos: Joi.string().required(),
                    });
                    Joi.validate(req.body, exerciseSchema, (err, result) => {
                        if (err) {
                            // res.status(201).json(err);
                            // return next(err);
                            throw new Error(`Config validation error: ${err.message}`);
                        } else {
                            // findByIdAndUpdate
                            // findOneAndUpdate
                            Exercise.findByIdAndUpdate(req.params.id, {
                                name: req.body.name,
                                title: req.body.title,
                                description: req.body.description,
                                image: req.body.image,
                                nameSound: req.body.nameSound,
                                procedure: req.body.procedure,
                                videos: req.body.videos,
                            }, {
                                new: true
                            }).then((result) => {
                                if (!result) {
                                    res.status(404).json({
                                        "message": "Exercise not found with id"
                                    });
                                }
                                res.status(200).json(result);
                            }).catch((err) => {
                                if (err.kind === 'ObjectId') {
                                    res.status(404).json({
                                        "message": "Exercise not found with id"
                                    });
                                    return;
                                }
                                res.status(500).json({
                                    "message": "Something wrong updating note with id "
                                });
                            });
                        }
                    });
                }
            }).catch((err) => {
                res.status(400).json(err);
            });
        }
    } catch (error) {
        res.json({
            "message": "block of code for errors!"
        });
    }
};
exports.exerciseDeleteOne = (req, res) => {};

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({
        "error": message,
        "ERROR": reason
    });
}