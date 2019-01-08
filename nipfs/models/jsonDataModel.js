
//dependencies
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var JsonDataSchema = new Schema({    
    fieldTitle: {
        type: Object,
    },
});

exports.JsonDataSchema = JsonDataSchema;
module.exports = mongoose.model('JsonData', JsonDataSchema);
