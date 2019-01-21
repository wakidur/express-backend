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
async  function getExerciseListPromise(userInfo) {
    return new Promise((resolve, reject) => {
        Exercise.find({})
            .then((result) => resolve(result))
            .catch(reject)
    });
 }

function exerciseReadById(id) {
    let deferred = Q.defer();
    Exercise.findById(id).then((result) => {
        deferred.resolve(result);
    }).catch((error) => {
       // deferred.reject(error);
        deferred.reject(new Error(error));
    });
    return deferred.promise;
}
function exerciseUpdateById(id) {
    let deferred = Q.defer();
    Exercise.findById(id).then((result) => {
        deferred.resolve(result);
    }).catch((error) => {
       // deferred.reject(error);
        deferred.reject(error);
    });
    return deferred.promise;
}

function saveExercise(value) {
    let deferred = Q.defer();
    let exercise = new Exercise(value);
    exercise.save().then((result) => {
        deferred.resolve(result);
    }).catch((err) => {
        deferred.reject(err);
    }); 
    return deferred.promise;
}

function exerciseDeleteById(id) {
    let deferred = Q.defer();
    Exercise.findByIdAndRemove(id).then((result) => {
        deferred.resolve(result);
    }).catch((error) => {
       // deferred.reject(error);
        deferred.reject(error);
    });
    return deferred.promise;
}

module.exports = {
    getExerciseList,
    exerciseReadById,
    exerciseUpdateById,
    saveExercise,
    exerciseDeleteById,
    getExerciseListPromise
   
};
