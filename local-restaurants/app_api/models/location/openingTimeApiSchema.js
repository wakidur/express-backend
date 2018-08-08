const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var openingTimeSchema = new Schema({
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
});

module.exports = mongoose.model('OpeningTimeApi', openingTimeSchema);