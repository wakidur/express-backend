const  mongoose  = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const { Schema } = mongoose;

const  GenreSchema = new Schema({
    name: {
        type: String,
        required:[true, 'Nave must have'],
        min: 0,
        max: 5,
    }
});

// Virtual for GenreSchema's URL 
GenreSchema.virtual('url').get(function () {
    return `/genre/genre/${this._id}`;
});
GenreSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Genre', GenreSchema);
