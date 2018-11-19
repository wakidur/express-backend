const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  fullName: {
    type: String,
    required: 'Full name can\'t be empty'
  },
  email: {
    type: String,
    required: 'Email can\'t be empty',
    unique: true
  },
  password: {
    type: String,
    required: 'Password can\'t be empty',
    minlength: [4, 'Password must be atleast 4 character long'],
    maxlength: [8, 'Password must be atleast 8 character leng']
  },
  saltSecret: String
});

// Custom validation for email
UserSchema.path('email').validate((val) => {
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(val);
}, 'Invalid e-mail.');
/**
 * Password hash middleware.
 */
UserSchema.pre('save', function (next) {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
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
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign(
    { 
      _id: this._id,
      email: this.email,
      name: this.fullName,
    },
      process.env.JWT_SECRET,
    {
      // expiresIn: process.env.JWT_EXP
      expiresIn: parseInt(expiry.getTime() / 1000)
    }
    );
};


// exports

module.exports = mongoose.model('User', UserSchema);