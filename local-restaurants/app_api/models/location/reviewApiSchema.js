const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var reviewSchema = new Schema({
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
    'default': Date.now
  }
  });
module.exports = mongoose.model('ReviewApi', reviewSchema);
  