const mongoose = require('mongoose');
const Q = require('q');

// Schema
const Exercise = require('../model/exerciseSchema');
const ExercisePlan = require('../model/exercisePlanSchema');
const WorkoutPlan = require('../model/workoutPlanSchema');

// Get Book List
function getWorkoutPlanList() {
    var deferred = Q.defer();
    WorkoutPlan.find({}).populate('exercises.exercise').then((result) => {
        deferred.resolve(result);
    }).catch((err) => {
        deferred.reject(err);
    });
    return deferred.promise;
}

function getWorkoutPlanById(id) {
    return new Promise((resolve, reject) => {
        WorkoutPlan.findById(id)
            .then((result) => resolve(result))
            .catch(reject)
    });
}


async function getWorkoutPlanByName(name) {
    return await new Promise((resolve, reject) => {
        WorkoutPlan.findOne({name: name}).then((result) => resolve(result)).catch(reject)
    });
}
// function getWorkoutPlanList() {
//     var deferred = Q.defer();
//     WorkoutPlan.find({}).populate({
//         path: 'exercises',
//         populate: {
//             path: 'exercise',
//             model: 'Exercise'
//         }
//     }).then((result) => {
//         deferred.resolve(result);
//     }).catch((err) => {
//         deferred.reject(err);
//     });
//     return deferred.promise;
// }

module.exports = {
    getWorkoutPlanList,
    getWorkoutPlanById,
    getWorkoutPlanByName

};