const Joi = require('joi');
const workoutLogEntryDS = require('../service/workoutLogEntryService');

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


exports.createWorkoutLogEntry = async function createWorkoutLogEntry(req, res, next) {
    try {
        if (!req.body) {
            res.status(400).json({
                "message": "Exercise content can not be empty"
            });
            return;
        }
        // Create a Exercise
        const durationsSchema = Joi.object({
            startedOn: Joi.date().required(),
            completed: Joi.boolean(),
            exercisesDone: Joi.number().required(),
            lastExercise: Joi.string(),
            endedOn: Joi.date(),
        });
        Joi.validate(req.body, durationsSchema, (err, value) => {
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

// Find a single Exercise with a exercise Id
exports.workoutLogEntryReadById = async function(req, res, next) {
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
};

// Update a exercise
exports.workoutLogEntryUpdateById = async function(req, res, next) {
    try {
        if (req.params && req.params.id) {
            const workoutLogEntryUpdate = await workoutLogEntryDS.workoutLogEntryUpdateById(req.params.id);

            if (workoutLogEntryUpdate) {
                if (!workoutLogEntryUpdate) {
                    res.status(404).json({
                        "message": "Exercise id not found"
                    });
                    return;
                } else {
                    res.status(200).json(workoutLogEntryUpdate);
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
    }
}


// Delete a note with the specified noteId in the request
exports.workoutLogEntryDeleteById = async function(req, res, next) {
    try {
        if (!req.params.id) {
            return res.status(404).json({
                "message": "Not found, Exercise id is required"
            });
        }
        const workoutLogEntryDelete = await workoutLogEntryDS.workoutLogEntryDeleteById(req.params.id);
        workoutLogEntryDelete.then((result) => {
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