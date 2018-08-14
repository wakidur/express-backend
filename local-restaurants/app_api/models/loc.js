var mongoose = require('mongoose');
var geoSchema = new mongoose.Schema({
    loc: {
        type: { type: String },
        coordinates: [Number],
    }
});

module.exports = mongoose.model('geolocation', geoSchema);