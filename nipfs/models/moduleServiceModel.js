//dependencies
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//class definition
var sectionSchema = new Schema({    
    sectionName: {
        type: String,
        required: true,
        trim: true
    },
    sectionDesc: {
        type: String
    }
});
    

sectionSchema.pre('save', function (next) {
    //console.log('page pre save called!');
    //console.log(this);
    next();
});



var pageSchema = new Schema({
    pageName: {
        type: String,
        required: true,
        trim: true
    },
    pageCode : {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    isMainPage :{
        type: Boolean
    },
    sectionList: [sectionSchema]
});


pageSchema.pre('save', function (next) {
    //console.log('page pre save called!');
    //console.log(this);
    next();
});


var moduleSchema = new Schema({
    moduleId: {
        type: String,
        required: true,
        //trim: true
    },
    fromPageRange: {
        type : Number,
        required: true
    },
    toPageRange: {
        type: Number,
        required: true
    },
    applicationId : {
        type: String,
        required: true
    },
    pageList: [pageSchema]
});

moduleSchema.pre('save', function (next) {
    //console.log("module pre save called!");
    //console.log(this);
    next();
});

module.exports = [mongoose.model('sectionCollection', sectionSchema), mongoose.model('pageCollection', pageSchema), mongoose.model('moduleCollection', moduleSchema)];