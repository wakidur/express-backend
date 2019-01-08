//Permissions config object

roles.admin = {
    id: "admin",
    name: "Admin",
    description: "",
    resource : [
        {
            id : 'blog', 
            permissions: ['create', 'read', 'update', 'delete']
        },
        {
            id : 'user',
            permissions: ['create', 'read', 'update', 'delete']
        },
        {
            id : 'journal',
            permissions: ['create', 'read', 'update', 'delete']
        },

    ]
};

roles.editor = {
    id: "editor",
    name: "Editor",
    description: "",
    resource : [
        {
            id : 'blog', 
            permissions: ['create', 'read', 'update', 'delete']
        },
        {
            id : 'user',
            permissions: ['read']
        },
        {
            id : 'journal',
            permissions: ['create', 'read', 'update']
        },

    ]
};

// -----------------------------
// Role schema 
var rolesSchema = new mongoose.Schema({
    roleName: {
        type: String,
        required: true,

    },
    actions:{
        type: Array, 
    }
});

// User Schema 
userSchema = new mongoose.Schema({
    first_name: String,
    last_name : String,
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'role'
    }
});

// ---------------------
var permissions_schema = mongoose.Schema({
    name : String,
    title : String
}); // this are mostly static data

var roles_schema = mongoose.Schema({
    name : String,
    title : String,
    _permissions : Array
});// _permissions is an array that contain permissions _id

var contacts_schema = mongoose.Schema({
    mobile : String,
    password : String,
    first_name : String,
    last_name : String,
    _role : Number,
    _enabled : Boolean,
    _deleted : Boolean,
    _verify_code : Number,
    _groups_id : Array,
    _service_id : String
}); // and at last _role is _id of the role which this user owns.

const UserSchema = new Schema({
	username: {
		type: String, 
		required: true, 
		unique: true
	},
	email: {
		type: String, 
		required: true, 
		unique: true
	},
	image: {
		type: String,
		required: true
	},
	accessToken: String,
	refreshToken: String,
	created_at: Date,
	updated_at: Date
});

UserSchema.plugin(require('mongoose-role'), {
	roles: ['public', 'user', 'manager', 'admin'],
  accessLevels: {
    'public': ['public', 'user', 'admin'],
    'anon': ['public'],
    'user': ['user', 'admin'],
    'admin': ['admin']
  }
});