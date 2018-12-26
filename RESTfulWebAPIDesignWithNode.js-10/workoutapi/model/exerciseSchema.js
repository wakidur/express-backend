const mongoose = require('mongoose');
//Define a schema
const Schema = mongoose.Schema;
const ExerciseModelSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name field required ?'],
        min: [2, 'Name charcter min 2'],
        max: [100, 'Name charcter min 2'],
    },
    title: {
        type: String,
        required: [true, 'title field required ?'],
        max: [100, 'Name charcter min 2'],
    },
    description: {
        type: String,
    },
    image: {
        type: String,
    },
    nameSound: {
        type: String,
    },
    procedure: {
        type: String,
    },
    videos: Array,
});

//Export function to create "SomeModel" model class
module.exports = mongoose.model('Exercise', ExerciseModelSchema);

