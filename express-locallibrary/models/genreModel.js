var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GenreSchema = new Schema({
    name: {
        type: String,
        required: true,
        max: 100,
    }
});

// Virtual for GenreSchema's URL 
GenreSchema
.virtual('url')
.get(function(){
    return '/genre/' + this._id;
});

// Export the model

module.exports = mongoose.model('Genre', GenreSchema);