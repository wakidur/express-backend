
//dependencies
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//class defination
var PageSecDataSchema = new Schema({
    // variabl declaration 
    typeId: {
        type: Number,
        require: true,
    },
    alphabet: {
        type: String,
        require: true,
    },
    code: {
        type: Number,
        require: true,
    },
    name: {
        type: String,
        require: true,
    },
    titleEN: {
        type: String,
        require: true,
    },
    titleBN: {
        type: String,
    },
    objectName: {
        type: String
    },

});

exports.PageSecDataSchema = PageSecDataSchema;
module.exports = mongoose.model('PageSection', PageSecDataSchema);