const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const itemSchema = new Schema({
    "itemId": {
        type: String,
        index: {
            unique: true
        }
    },
    "itemName": String,
    "price": Number,
    "currency": String,
    "categories": [String]
});

// Export Model

module.exports = mongoose.model('Item', itemSchema);