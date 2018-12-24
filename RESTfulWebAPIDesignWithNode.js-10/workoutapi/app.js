 const express = require('express');
 const cors = require('cors');
 const path = require('path');
 const cookieParser = require('cookie-parser');
 const bodyParser = require('body-parser');
 const mongoose = require('mongoose');




const  users = require('./routes/users');

const  app = express();

/**
 * Connect to MongoDB.
 */
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/workoutapi", {
  useNewUrlParser: true
});
mongoose.connection.once('open', () => {
    console.log('MongoDB database connection established successfully!');
});
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.');
  process.exit();
});


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({"error": message});
  }

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

app.use('/api/v1/users', users);

module.exports = app;
