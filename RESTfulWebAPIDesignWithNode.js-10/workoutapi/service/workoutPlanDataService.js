const mongoose = require('mongoose');
const Q = require('q');

// Schema
const Exercise = require('../model/exerciseSchema');
const ExercisePlan = require('../model/exercisePlanSchema');
const WorkoutPlan = require('../model/workoutPlanSchema');

// Get Book List
function getWorkoutPlanList() {
    var deferred = Q.defer();
    WorkoutPlan.find({}).populate({
        path: 'exercises',
        populate: {
            path: 'exercise',
            model: 'Exercise'
        }
    }).then((result) => {
        deferred.resolve(result);
    }).catch((err) => {
        deferred.reject(err);
    });
    return deferred.promise;
}

module.exports = {
    getWorkoutPlanList,

};