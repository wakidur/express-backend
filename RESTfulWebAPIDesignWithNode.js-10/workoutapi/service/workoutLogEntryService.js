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
    const workoutLogEntry = new WorkoutLogEntry(userInfo);
    return new Promise((resolve, reject) => {
        workoutLogEntry.save()
            .then((result) => resolve(result))
            .catch(reject)
    });
 }

module.exports = {
    getAllWorkoutLogEntryPromise,
    saveWorkoutLogEntryPromise
   
};