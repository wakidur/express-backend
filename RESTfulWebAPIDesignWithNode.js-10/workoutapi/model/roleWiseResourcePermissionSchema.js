const mongoose = require('mongoose');
// Define a schema
const Schema = mongoose.Schema;
// A mapping between the resources and the roles that define who can access what
const roleWiseResourcePermissionSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    role_id: [{
        type: Schema.Types.ObjectId,
        ref: 'ListOfRoles'
    }],
    resource_id: [{
        type: Schema.Types.ObjectId,
        ref: 'ListOfResource'
    }]
});
//Export function to create "SomeModel" model class
module.exports = mongoose.model('RoleWiseResourcePermission', roleWiseResourcePermissionSchema);