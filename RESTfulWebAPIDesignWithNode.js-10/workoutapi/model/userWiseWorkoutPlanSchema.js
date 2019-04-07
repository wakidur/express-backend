const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define a schema
//  users that are part of these roles
const userWiseWorkoutPlanSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "User name is required!"],
    },
    workouts_id: [{
        type: Schema.Types.ObjectId,
        ref: 'WorkoutPlan',
        required: [true, "This field is required!!"],
    }],

});
//Export function to create "SomeModel" model class
module.exports = mongoose.model('UserWiseWorkoutPlan', userWiseWorkoutPlanSchema);