const mongoose = require('mongoose');
const Q = require('q');

// Schema
const Exercise = require('../model/exerciseSchema');
const ExercisePlan = require('../model/exercisePlanSchema');
const WorkoutPlan = require('../model/workoutPlanSchema');

// Get Book List
function getWorkoutPlanList() {
    var deferred = Q.defer();
    WorkoutPlan.find({})
        .populate('exercises')
        .exec(function (err, list_books) {
            if (err) {
                deferred.reject(err);
            }
            //sucessfull , 
            deferred.resolve(list_books);
        });
    return deferred.promise;
    
}

module.exports = {
    getWorkoutPlanList,
   
};
