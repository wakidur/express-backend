const Joi = require('joi');
const durationsDS = require('../service/durationsService');

exports.getAllDurations = async function getAllDurations(req, res, next) {
    try {
        const durationsInfo = await durationsDS.getAllDurationsPromise();
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


exports.createDuration = async function createDuration(req, res, next) {
    try {
        if (!req.body) {
            res.status(400).json({
                "message": "Exercise content can not be empty"
            });
            return;
        }
        // Create a Exercise
        const durationsSchema = Joi.object({
            title: Joi.string().required(),
            seconds: Joi.string().required(),
        });
        Joi.validate(req.body, durationsSchema, (err, value) => {
            if (err) {
                res.status(201).json(err);
            } else {
                durationsDS.saveDurationsPromise(value).then((result) => {
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

