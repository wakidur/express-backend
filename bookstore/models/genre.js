var mongoose = require('mongoose');

// Genre Schema
var genreSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    create_data: {
        type: Date,
        default: Date.now
    }
});

var Genre = module.exports = mongoose.model('Genre', genreSchema);

// get Genres
module.exports.getGenres = function (callback, limit) {
    Genre.find(callback).limit(limit);
}