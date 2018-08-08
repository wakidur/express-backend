const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var locationSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  address: String,
  rating: {
    type: Number,
    'default': 0,
    min: 0,
    max: 5
  },
  facilities: [String],
  coords: {
    type: [Number],
    index: '2dsphere'
  },
  openingTimes: {
    type: Schema.ObjectId,
    ref: 'OpeningTimeApi',
    required: true
  },
  reviews: {
    type: Schema.ObjectId,
    ref: 'ReviewApi',
    required: true
  }

});
//Export model
module.exports = mongoose.model('Location', locationSchema);