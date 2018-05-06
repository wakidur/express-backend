/**
 * mongoose
 */
// Defining your schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var blogSchema = new Schema({
    title: String,
    author: String,
    body: String,
    comments: [{body: String, data: Date}],
    date: {type: Date, default: Date.now},
    hidden: Boolean,
    mate: {votes: Number, favs: Number}
});



/*
* From monzila developer 
*/
// Require Mongoose

var mongoose = require('mongoose');

// Define a schem 

var Schema = mongoose.Schema;

var someModelSchema = new Schema({
    a_string: String,
    a_date : Data
});

