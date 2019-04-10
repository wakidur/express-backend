const mongoose = require('mongoose');
const Q = require('q');

// Schema
const Exercise = require('../model/exerciseSchema');
const UserWiseExercise = require('../model/userWiseExerciseSchema');
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

async function getExerciseForkJoin() {
    return await new Promise((resolve, reject) => {
        Exercise.find({})
            .then((result) => resolve(result))
            .catch(reject)
    }).catch(() => {
        console.log('bam errored');
        throw 'bam';
    });
}

async function getExerciseListPromise(userInfo) {
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

function getUserWiseExercise(userid) {
    return new Promise((resolve, reject) => {
        UserWiseExercise.find().populate({
            path: 'user_id',
            select: ['fullname', 'email', 'userImage']
        }).populate('exercise_id').then((result) => {
            resolve(result);
        }).catch((err) => {
            reject(err);
        });
    });
}

function postUserWiseExercise(userid, exerciseid) {
    return new Promise((resolve, reject) => {
        const userWiseExercise = new UserWiseExercise({
            user_id: userid,
            exercise_id: exerciseid
        });
        userWiseExercise.save().then((result) => {
            resolve(result);
        }).catch((err) => {
            reject(err);
        });
    });
}

function getUserIdFromUserWiseExercise(id) {
    return new Promise((resolve, reject) => {
        UserWiseExercise.find({
            user_id: id
        }).then((result) => {
            resolve(result);
        }).catch((err) => {
            reject(err);
        });
    });
}

function updateUserWiseExerciseById(userWiseExerciseId, updateId) {
    return new Promise((resolve, reject) => {
        UserWiseExercise.findByIdAndUpdate(
            userWiseExerciseId, {
                $push: {
                    exercise_id: updateId
                }
            }, {
                new: true
            }).then((result) => {
            resolve(result);
        }).catch((err) => {
            reject(err);
        });
    });
}

module.exports = {
    getExerciseList,
    exerciseReadById,
    exerciseUpdateById,
    saveExercise,
    exerciseDeleteById,
    getExerciseListPromise,
    getExerciseForkJoin,
    getUserWiseExercise,
    postUserWiseExercise,
    getUserIdFromUserWiseExercise,
    updateUserWiseExerciseById
};