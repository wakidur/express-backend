const mongoose = require('mongoose');
//Define a schema
const Schema = mongoose.Schema;
const WorkoutPlanModelSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    restBetweenExercise: {
        type: Number,
        required: true
    },
    exercises: [{
        type: Schema.ObjectId,
        ref: 'ExercisePlan',
        required: true
    }],
    description: {
        type: String,
    }
});

// Virtual for this WorkoutPlan object's totalWorkoutDuration.
WorkoutPlanModelSchema.virtual('totalWorkoutDuration').get(function () {
    if (this.exercises) {
        return 0;
    } else {
        const totalDuratuon = this.exercises
            .map((e) => e.duration)
            .reduce((previous, current) => parseInt(previous, 10) + parseInt(current, 10));
        return (this.restBetweenExercise ? this.restBetweenExercise : 0) * (this.exercises.length - 1) + totalDuratuon;
    }
});

//Export function to create "SomeModel" model class
module.exports = mongoose.model('WorkoutPlan', WorkoutPlanModelSchema);