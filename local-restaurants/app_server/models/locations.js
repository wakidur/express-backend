const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const locationSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  address: String,
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  facilities: [String],
  coords: {
    type: [Number],
    index: '2dsphere'
  },
  openingTimes: [{
    days: {
      type: String,
      required: true
    },
    opening: String,
    closing: String,
    closed: {
      type: Boolean,
      required: true
    }
  }],
  reviews: [{
    author: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5
    },
    reviewText: {
      type: String,
      required: true
    },
    createdOn: {
      type: Date,
      default: Date.now
    }
  }]
});
//Export function to create "SomeModel" model class
module.exports = mongoose.model('Locatondata', locationSchema);