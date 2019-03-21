const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define a schema
//  users that are part of these roles
const userRolesSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "User name is required!"],
    },
    role_id: [{
        type: Schema.Types.ObjectId,
        ref: 'ListOfRoles',
        required: [true, "User role is required at list guest role must be choose!"],
    }],

});
//Export function to create "SomeModel" model class
module.exports = mongoose.model('UserRoles', userRolesSchema);