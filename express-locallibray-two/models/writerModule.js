var mongoose = require('mongoose');
var moment = require('moment');
var Schema = mongoose.Schema;

var WriterSchema = new Schema({
    first_name: {
        type: String,
        required: true,
        max: 100
    },
    family_name: {
        type: String,
        required: true,
        max: 100
    },
    date_of_birth: {
        type: Date
    },
    date_of_death: {
        type: Date
    },
});

// Virtual for author's full name
WriterSchema
    .virtual('name')
    .get(function () {
        return this.family_name + ', ' + this.first_name;
    });

// Virtual for author's URL
WriterSchema
    .virtual('url')
    .get(function () {
        return '/writer/' + this._id;
    });
// virtual date format
WriterSchema
    .virtual('date_of_birth_formatted')
    .get(function () {
        return this.date_of_birth ? moment(this.date_of_birth).format('YYYY-MM-DD') : '';
    });
// virtual date format
WriterSchema
    .virtual('date_of_death_formatted')
    .get(function () {
        return this.date_of_death ? moment(this.date_of_death).format('YYYY-MM-DD') : '';
    });
//Export model
module.exports = mongoose.model('Writer', WriterSchema);