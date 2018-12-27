const mongoose = require('mongoose');
const Q = require('q');

// Schema
const Exercise = require('../model/exerciseSchema');
const ExercisePlan = require('../model/exercisePlanSchema');
const WorkoutPlan = require('../model/workoutPlanSchema');

// Get Book List
function getExerciseList() {
    let deferred = Q.defer();
    Exercise.find({}).then((result) => {
        deferred.resolve(result);
    }).catch((err) => {
        deferred.reject(err);
    });
       
    return deferred.promise;
}

function findById(id) {
    let deferred = Q.defer();
    Exercise.findById(id).then((result) => {
        deferred.resolve(result);
    }).catch((err) => {
        deferred.reject(err);
    });
    
    return deferred.promise;
}

module.exports = {
    getExerciseList,
    findById
   
};
