 const express = require('express');
 const cors = require('cors');
 const path = require('path');
 const cookieParser = require('cookie-parser');
 const bodyParser = require('body-parser');
 //Import the mongoose module
 const mongoose = require('mongoose');

 const users = require('./routes/users');
 const trainerRoutes = require('./routes/trainerRoutes');

 const app = express();

 /**
  * Connect to MongoDB.
  */
 //Set up default mongoose connection
 const mongoUri = 'mongodb://localhost:27017/trainerapp';
 mongoose.connect(process.env.MONGODB_URI || mongoUri, {
     useNewUrlParser: true,
     keepAlive: 1
 });
 // Get Mongoose to use the global promise library
 mongoose.Promise = global.Promise;
 mongoose.connection.once('open', () => {
     console.log('MongoDB database connection established successfully!');
 });
 mongoose.connection.on('error', () => {
     console.error(err);
     console.log('%s MongoDB connection error. Please make sure MongoDB is running.');
     process.exit();
     throw new Error(`unable to connect to database: ${mongoUri}`);
 });


 app.use(cors());
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({
     extended: false
 }));
 app.use(cookieParser());



 // error handler
 app.use((err, req, res, next) => {
     if (err.name === 'ValidationError') {
         var valErrors = [];
         Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
         res.status(422).send(valErrors);
     } else {
         res.status(500)
             .json({
                 status: err.status,
                 message: err.message
             });
     }

 });

 app.use('/api/users', users);
 app.use('/api', trainerRoutes);

 module.exports = app;