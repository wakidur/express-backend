let mongoose = require("mongoose");
let Schema = mongoose.Schema;

//class defination
var ApplicationDataSchema = new Schema({
    // variabl declaration 
    name: {
        type: String,
        require: true,
    },
    shortName: {
        type: String,
        require: true,
    }
    
});

// Export model exports.ApplicationDataSchema = ApplicationDataSchema;
module.exports = mongoose.model('Application', ApplicationDataSchema);

