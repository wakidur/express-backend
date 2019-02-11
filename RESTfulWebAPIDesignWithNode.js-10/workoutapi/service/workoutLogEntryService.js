const mongoose = require('mongoose');
const WorkoutLogEntry = require('../model/workoutLogEntrySchema');

async function getAllWorkoutLogEntryPromise(userInfo) {
    return new Promise((resolve, reject) => {
        WorkoutLogEntry.find({})
            .then((result) => resolve(result))
            .catch(reject);
    });
}

async function saveWorkoutLogEntryPromise(userInfo) {
    const workoutLogEntry = new WorkoutLogEntry({
        startedOn: userInfo.startedOn,
        endedOn: userInfo.endedOn,
        completed: userInfo.completed,
        exercisesDone: userInfo.exercisesDone,
        lastExercise: userInfo.lastExercise,
    });
    return new Promise((resolve, reject) => {
        workoutLogEntry.save()
            .then((result) => resolve(result))
            .catch(reject)
    });
}


async function workoutLogEntryReadById(id) {
    return new Promise((resolve, reject) => {
        WorkoutLogEntry.findById(id)
            .then((result) => resolve(result))
            .catch(reject)
    });
}

async function workoutLogEntryUpdateById(id, object) {
    return new Promise((resolve, reject) => {
        WorkoutLogEntry.findByIdAndUpdate(id, {
                startedOn: object.startedOn,
                completed: object.completed,
                exercisesDone: object.exercisesDone,
                lastExercise: object.lastExercise,
                endedOn: object.endedOn,
            }, {
                new: true
            }).then((result) => resolve(result))
            .catch(reject);
    });
}

async function workoutLogEntryDeleteById(id) {
    return new Promise((resolve, reject) => {
        WorkoutLogEntry.findByIdAndRemove(id)
            .then((result) => resolve(result))
            .catch(reject)
    });
}
module.exports = {
    getAllWorkoutLogEntryPromise,
    saveWorkoutLogEntryPromise,
    workoutLogEntryReadById,
    workoutLogEntryUpdateById,
    workoutLogEntryDeleteById

};