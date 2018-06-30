
//dependencies
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//class defination
var FieldValidationSchema = new Schema({
    // variabl declaration 
    name: {
        type: String,
        require: true
    },
    alphabet: {
        type: String,
        require: true
    },
    message: {
        type: String,
        require: true
    },
    applicationId: {
        type: String,
        required: true
    }

});

exports.FieldValidationSchema = FieldValidationSchema;
module.exports = mongoose.model('FieldValidation', FieldValidationSchema);