 const express = require('express');
 const cors = require('cors');
 const path = require('path');
 const cookieParser = require('cookie-parser');
 const bodyParser = require('body-parser');
 //Import the mongoose module
 const mongoose = require('mongoose');

const  users = require('./routes/users');
const  trainerRoutes = require('./routes/trainerRoutes');

const  app = express();

/**
 * Connect to MongoDB.
 */
//Set up default mongoose connection
const  mongoDB = 'mongodb://localhost:27017/trainerapp';
mongoose.connect(process.env.MONGODB_URI || mongoDB, {
  useNewUrlParser: true
});
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;

//Get the default connection
let db = mongoose.connection;
db.once('open', () => {
    console.log('MongoDB database connection established successfully!');
});
db.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.');
  process.exit();
});


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());



// error handler
app.use((err, req, res, next) => {
    if (err.name === 'ValidationError') {
        var valErrors = [];
        Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
        res.status(422).send(valErrors);
    }
    else{
        console.log(err);
    }
});

app.use('/api/users', users);
app.use('/api', trainerRoutes);

module.exports = app;
