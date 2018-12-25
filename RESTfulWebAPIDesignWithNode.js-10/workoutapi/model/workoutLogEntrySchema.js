const mongoose  = require('mongoose');
//Define a schema
const Schema = mongoose.Schema; 
const WorkoutLogEntryModelSchema = new Schema ({});

//Export function to create "SomeModel" model class
module.exports = mongoose.model('WorkoutLogEntryModel', WorkoutLogEntryModelSchema );