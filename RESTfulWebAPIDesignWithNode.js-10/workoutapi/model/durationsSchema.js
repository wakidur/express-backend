const mongoose = require('mongoose');
//Define a schema
const DurationsModelSchema = mongoose.Schema({
    title: {
        type: String,
    },
    seconds: {
        type: Number,
    }
}, {
    timestamps: true
});

//Export function to create "SomeModel" model class
module.exports = mongoose.model('Durations', DurationsModelSchema);