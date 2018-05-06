var mongoose = require('mongoose');
// define schema 
var Schema = mongoose.Schema;

var SomeModelSchema = new Schema({
    a_string: String,
    a_date: Date
});

// Compile model from schema

var SomeModel = mongoose.model('SomeModel', SomeModelSchema );
// The first argument is the singular name of the collection that will be created for your model(Mongoose will create the database collection for the above model SomeModel about) and the second argument is the schema you want to use in creating the model