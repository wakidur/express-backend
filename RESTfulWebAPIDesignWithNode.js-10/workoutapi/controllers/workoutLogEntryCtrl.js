const Joi = require('joi');
const durationsDS = require('../service/workoutLogEntryService');

exports.getAllWorkoutLogEntry = async function getAllWorkoutLogEntry(req, res, next) {
    try {
        const durationsInfo = await durationsDS.getAllWorkoutLogEntryPromise();
        if (durationsInfo) {
            res.status(200).json(durationsInfo);
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
            startedOn: Joi.string().required(),
            completed: Joi.string().required(),
            exercisesDone: Joi.string().required(),
        });
        Joi.validate(req.body, durationsSchema, (err, value) => {
            if (err) {
                res.status(201).json(err);
            } else {
                durationsDS.saveWorkoutLogEntryPromise(value).then((result) => {
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
};