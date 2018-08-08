const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
    author: String,
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },
    reviewText: String,
    createdOn: {
        type: Date,
        'default': Data.now
    }
});

//Export model
module.exports = mongoose.model('Review', openingTimeSchema);