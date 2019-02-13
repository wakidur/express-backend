const Joi = require('joi');
const workoutLogEntryDS = require('../service/workoutLogEntryService');

// get All Workout Log Entry
exports.getAllWorkoutLogEntry = async function getAllWorkoutLogEntry(req, res, next) {
    try {
        const workoutLogEntryInfo = await workoutLogEntryDS.getAllWorkoutLogEntryPromise();
        if (workoutLogEntryInfo) {
            res.status(200).json(workoutLogEntryInfo);
        } else {
            res.status(4040).json({
                message: "There have nothing "
            });
        }

    } catch (error) {
        res.json(error);
    }

}

// create Workout Log Entry
exports.createWorkoutLogEntry = (req, res, next) => {
    try {
        if (!req.body) {
            res.status(400).json({
                "message": "Exercise content can not be empty"
            });
            return;
        }
        // Create a Exercise
        const workoutLogEntryJoi = Joi.object({
            startedOn: Joi.date().required(),
            completed: Joi.boolean(),
            exercisesDone: Joi.number().required(),
            lastExercise: Joi.string(),
            endedOn: Joi.date(),
        });
        Joi.validate(req.body, workoutLogEntryJoi, (err, value) => {
            if (err) {
                res.status(201).json(err);
            } else {
                workoutLogEntryDS.saveWorkoutLogEntryPromise(value).then((result) => {
                    res.status(201).json(result);
                }).catch((err) => {
                    next(err);
                });
            }
        });
    } catch (error) {
        res.json({
            "message": "block of code for errors!"
        });
    }
}

// workout Log Entry Read By Id
exports.workoutLogEntryReadById = async function (req, res, next) {
    /**
     * The try statement lets you test a block of code for errors.
     * The catch statement lets you handle the error.
     * The throw statement lets you create custom errors.
     */
    try {
        if (req.params && req.params.id) {
            const workoutLogEntryReadBy = await workoutLogEntryDS.workoutLogEntryReadById(req.params.id);

            if (workoutLogEntryReadBy) {
                if (!workoutLogEntryReadBy) {
                    res.status(404).json({
                        "message": "Exercise id not found"
                    });
                    return;
                } else {
                    res.status(200).json(workoutLogEntryReadBy);
                }
            } else {
                if (err.kind === "ObjectId") {
                    res.status(404).json({
                        "message": "Exercise not found"
                    });
                }
                res.status(500).json({
                    "message": "Something wrong retrieving product with id "
                });
            }
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
}

// workout Log Entry Update By Id
exports.workoutLogEntryUpdateById = async function (req, res, next) {
    try {
        if (req.params && req.params.id) {
            const workoutLogEntryReadBy = await workoutLogEntryDS.workoutLogEntryReadById(req.params.id);

            if (workoutLogEntryReadBy) {
                const workoutLogEntryJoi = Joi.object({
                    startedOn: Joi.date().required(),
                    completed: Joi.boolean(),
                    exercisesDone: Joi.number().required(),
                    lastExercise: Joi.string(),
                    endedOn: Joi.date(),
                });
                Joi.validate(req.body, workoutLogEntryJoi, (err, result) => {
                    if (err) {
                        next(err);
                    } else {
                        workoutLogEntryDS.workoutLogEntryUpdateById(req.params.id, req.body).then((result) => {
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
            } else {
                res.status(404).json({
                    "message": "Exercise id not found"
                });
                return;
            }
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

// workout Log Entry Delete By Id
exports.workoutLogEntryDeleteById = async function (req, res, next) {
    try {
        if (!req.params.id) {
            return res.status(404).json({
                "message": "Not found, Exercise id is required"
            });
        }
        workoutLogEntryDS.workoutLogEntryDeleteById(req.params.id).then((result) => {
            if (!result) {
                return res.status(404).json({
                    "message": "Exercise not found with id"
                });
            } else {
                res.status(200).json({
                    "message": "Exercise deleted successfully!"
                });
            }
        }).catch((err) => {
            if (err.kind === "Object" || err.kind === "ObjectID" || err.name === "NotFound") {
                return res.status(404).json({
                    "message": "Exercise  not found with id"
                });
            } else {
                return res.status(500).json({
                    "message": "Could  not delete Exercise with id"
                });
            }
        });
    } catch (error) {
        res.json({
            "message": "block of code for errors!"
        });
    }

}