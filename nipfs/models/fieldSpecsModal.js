
//dependencies
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//class defination
var fieldSpecsDataSchema = new Schema({

    moduleId: {
        type: String,
        require: true
    },
    pageId: {
        type: String,
        require: true
    },
    mainPageId: {
        type: String,
        require: true
    },
    sectionId: {
        type: String,
        //require: true
    },
    fieldId: {
        type: String,
        require: true
    },
    maxLength: {
        type: Number,
    },
    fieldDesc: {
        type: String,
    },
    minLength: {
        type: Number,
    },
    scale: {
        type: Number,
    },
    length: {
        type: Number,
    },
    isMandatory: {
        type: Boolean,
        //require: true
    },
    permValues: {
        type: String,
        require: true
    },
    isEditable: {
        type: Boolean,
        required: true
    },
    inputTypeId: {
        type: Number,
        required: true
    },
    shortFullTypeVal: {
        type: String,
        required: true
    },
    applicationId: {
        type: String,
        required: true
    }


});

exports.fieldSpecsDataSchema = fieldSpecsDataSchema;
module.exports = mongoose.model('FieldSpecs', fieldSpecsDataSchema);