const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

//Define a schema
const UserSchema = mongoose.Schema({
    fullname: {
        type: String,
        required: [true, "Full name can\'t be empty"],
        min: [1, 'Name charcter min 1'],
        max: [50, 'Name charcter min 5'],
    },
    email: {
        type: String,
        required: [true, "Email can\'t be empty"],
        unique: true,
        // Regexp to validate emails with more strict rules as added in tests/users.js which also conforms mostly with RFC2822 guide lines
        match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email'],

    },
    password: {
        type: String,
        required: "Password can\'t be empty",
        minlength: [4, "Password must be atleast 4 character long"]
    },
    saltSecret: String,
    hashedPassword: {
        type: String,
        required: false
    },
    userImage: {
        type: String,
        required: false
    },
    designation: String,
    address: String,
    country: String,
    city: String,
    mobile: String,
    phone: String,
    birthofdate: Date,
    zip: String,

}, {
    timestamps: true,
    versionKey: false
});

// Custom validation for email
// UserSchema.path('email').validate((val) => {
//     emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//     return emailRegex.test(val);
// }, 'Invalid e-mail.');

// Events
UserSchema.pre('save', function (next) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(this.password, salt, (err, hash) => {
            this.password = hash;
            this.saltSecret = salt;
            next();
        });
    });
});

// Methods
UserSchema.methods.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

/*
Another way to generate a token like this with this library is:
jwt.sign({
  data: 'foobar'
}, 'secret', { expiresIn: 60 * 60 });

//or even better:

jwt.sign(
  {
  data: 'foobar'
}, 'secret', 
{ expiresIn: '1h' }
);
*/

UserSchema.methods.generateJwt = function () {

    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 1);
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.fullName,
            roles: this.role
        },
        config.jwtSecret, 
        {
            // expiresIn: process.env.JWT_EXP
            expiresIn: parseInt(expiry.getTime() / 1000)
        }
    );
};
// UserSchema.methods.generateJwt = function ()  {
//     return jwt.sign({_id: this._id}, config.jwtSecret, {expiresIn: config.jwtEXP});
// };


//Export function to create "SomeModel" model class
module.exports = mongoose.model('User', UserSchema);