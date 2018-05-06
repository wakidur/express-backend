var breakfastSchema = new Schema({
    eggs: {
        type: Number,
        min: [6, 'Too few eggs'],
        max: 12,
        required: [true, "Why no eggs?"]
    },
    drink: {
        type: String,
        enum: ['Coffee', 'Tea', 'Water']
    }
});