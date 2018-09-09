const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let GenreSchema = new Schema({
    name: {
        type: String,
        required: true,
        max: 100,
    }
});

// Virtual for GenreSchema's URL 
GenreSchema.virtual('url').get(function () {
    return `/genre/genre/${this._id}`;
});

module.exports = mongoose.model('Genre', GenreSchema);