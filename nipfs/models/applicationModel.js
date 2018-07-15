
//dependencies
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//class defination
var ApplicationDataSchema = new Schema({
    // variabl declaration 
    name: {
        type: String,
        require: true,
    },
    shortName: {
        type: String,
        require: true,
    }
    
});

// exports.ApplicationDataSchema = ApplicationDataSchema;
module.exports = mongoose.model('Application', ApplicationDataSchema);