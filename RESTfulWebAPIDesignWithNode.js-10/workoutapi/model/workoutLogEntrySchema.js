const mongoose = require('mongoose');
const moment = require('moment');
//Define a schema
const WorkoutLogEntryModelSchema = mongoose.Schema({
    completed: {
        type: Boolean,
    },
    exercisesDone: {
        type: Number
    },
    lastExercise: {
        type: String
    },
    startedOn: {
        type: Date
    },
    endedOn: {
        type: Date
    },
});

// Virtual for author's URL
WorkoutLogEntryModelSchema
    .virtual('url')
    .get(function () {
        return '/duration/' + this._id;
    });
// virtual date format
WorkoutLogEntryModelSchema
    .virtual('startedOn_formatted')
    .get(function () {
        return this.startedOn ? moment(this.startedOn).format('YYYY-MM-DD') : '';
    });
// virtual date format
WorkoutLogEntryModelSchema
    .virtual('endedOn_formatted')
    .get(function () {
        return this.endedOn ? moment(this.endedOn).format('YYYY-MM-DD') : '';
    });

//Export function to create "SomeModel" model class
module.exports = mongoose.model('WorkoutLogEntry', WorkoutLogEntryModelSchema);