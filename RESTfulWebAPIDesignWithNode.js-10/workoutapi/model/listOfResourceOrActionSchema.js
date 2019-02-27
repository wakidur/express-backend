const mongoose = require('mongoose');
//Define a schema
// A list of resources 
const listOfResourceOrActionSchema = mongoose.Schema({
    name: {
        type: String
    }
});
//Export function to create "SomeModel" model class
module.exports = mongoose.model('ListOfResource', listOfResourceOrActionSchema);