const mongoose = require('mongoose');
const moment = require('moment');
const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'First Name is require'],
        max: 20,
        min: 1
    },
    lastName: {
        type: String,
        required: [true, 'Last Name is required'],
        max: 15,
        min: 0
    },
    professionalBackground: {
        type: String,
        required: false,
        max: 50,
        min: 0
    },
    education: {
        type: String,
        required: false,
        max: 50,
        min: 0
    },
    currentBusinessOrProfession: {
        type: String,
        required: false,
        max: 50,
        min: 0
    },
    achievementsOrAwards: {
        type: String,
        required: false,
        max: 50,
        min: 0
    },
    PreviousPublishingExperience: {
        type: String,
        required: false,
        max: 50,
        min: 0
    },
    personalDetails: {
        family: {
            wifeName: String,
            childName: String
        },
        cityOfResidence: String,
        location: String,
    },
    contactInformation: {
        email: {
            type: String,
            unique: true
        },
        website: String,
        phoneNumber: String,
        picture: String
    },
    whatAuthorSaid: {
        type: String,
        max: 300,
        min: 0
    },
    dateOfBirth: {
        type: Date,
    },
    dateOfDeath: {
        type: Date
    }
});

// Virtual for author's full name 
AuthorSchema.virtual('name').get(function(){
    return this.firstName + ' , ' + this.lastName;
});

// Virtual for author's URL
AuthorSchema.virtual('url').get(function(){return '/author' + this._id});

// Virtual date_of_birth formate
AuthorSchema.virtual('dateOfBirthFormatted').get(function(){
    return this.dateOfBirth ? moment(this.dateOfBirth).format('YYYY-MM-DD') : '';
});

// Virtual date of Death formate
AuthorSchema.virtual('dateOfDeathFormatted').get(function(){
    return this.dateOfDeath ? moment(this.dateOfDeath).format('YYYY-MM-DD') : '';
});

// Export Model

module.exports = mongoose.model('Author', AuthorSchema);
