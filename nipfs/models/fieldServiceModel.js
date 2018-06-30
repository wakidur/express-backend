
//dependencies
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//class defination
var FieldServiceDataSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    //code: {
    //    type: Number,
    //    require: true
    //},
    l: {   // label 
        type: String
    },
    sh: { // short header 
        type: String
    },
    fh: {  // full header 
        type: String
    },
    refIndex: {
        type: String,
        require: true
    },
    lBangla: {
        type: String
    },
    shBangla: {
        type: String
    },
    fhBangla: {
        type: String
    },
    objectName: {
        type: String
    },
    desc: {
        type: String
    },
    descBangla: {
        type: String
    },
    minLength: {
        type: Number,
        //require: true
    },
    maxLength: {
        type: Number,
        //require: true
    },
    length: {
        type: Number,
        require: true
    },
    values: {
        type: String,
        //require: true
    },
    dataType: {
        type: Number,
        //require: true
    },
    scale: {
        type: Number
    },
    applicationId: {
        type: String,
        required: true
    }
    //moduleId: {
    //    type: String,
    //    required: true,
    //}
});

exports.FieldServiceDataSchema = FieldServiceDataSchema;
module.exports = mongoose.model('FieldService', FieldServiceDataSchema);