const mongoose  = require('mongoose');
//Define a schema
const Schema = mongoose.Schema; 
const ExerciseProgressEventModelSchema = new Schema ({});

//Export function to create "SomeModel" model class
module.exports = mongoose.model('ExerciseProgressEventModel', ExerciseProgressEventModelSchema );