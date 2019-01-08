
//dependencies
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//class defination
var ModuleEntrySchema = new Schema({
    // variabl declaration 
    name: {
        type: String,
        require: true,
    },
    code : {
        type: String,
        require: true,
    },
    applicationId: {
        type: String,
        require: true,
    }
    

});

exports.ModuleEntrySchema = ModuleEntrySchema;
module.exports = mongoose.model('moduleEntry', ModuleEntrySchema);