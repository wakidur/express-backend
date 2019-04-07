const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define a schema
//  users that are part of these roles
const userWiseWorkoutLogEntrySchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "User name is required!"],
    },
    WorkoutLogEntry_id: [{
        type: Schema.Types.ObjectId,
        ref: 'WorkoutLogEntry',
        required: [true, "This field is required!!"],
    }],

});
//Export function to create "SomeModel" model class
module.exports = mongoose.model('UserWiseWorkoutLogEntry', userWiseWorkoutLogEntrySchema);