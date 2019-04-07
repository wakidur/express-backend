const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define a schema
//  users that are part of these roles
const userWiseExerciseSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "User name is required!"],
    },
    exercise_id: [{
        type: Schema.Types.ObjectId,
        ref: 'Exercise',
        required: [true, "This field is required!"],
    }],

});
//Export function to create "SomeModel" model class
module.exports = mongoose.model('UserWiseExercise', userWiseExerciseSchema);