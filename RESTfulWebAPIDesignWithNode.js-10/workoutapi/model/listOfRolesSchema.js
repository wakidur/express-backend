const mongoose = require('mongoose');
// Define a schema
// A list of roles
const listOfRolesSchema = mongoose.Schema({
    name: {
        type: String,
    }
});
//Export function to create "SomeModel" model class
module.exports = mongoose.model('ListOfRoles', listOfRolesSchema);