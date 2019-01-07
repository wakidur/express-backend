 const express = require('express');
 const cors = require('cors');
 const path = require('path');
 const cookieParser = require('cookie-parser');
 const bodyParser = require('body-parser');
 //Import the mongoose module
 const mongoose = require('mongoose');

 const config = require('./config/config');
 const users = require('./routes/users');
 const trainerRoutes = require('./routes/trainerRoutes');

 const app = express();

 /**
  * Connect to MongoDB.
  */
 //Set up default mongoose connection
 const mongoUri = config.mongo.host;
 const mongoUrimlab = config.mongo.hostserver;
 mongoose.connect(mongoUri, {
     useNewUrlParser: true,
     keepAlive: 1
 });
 // Get Mongoose to use the global promise library
 mongoose.Promise = global.Promise;
 mongoose.connection.once('open', () => {
     console.log('MongoDB database connection established successfully!');
 });
 mongoose.connection.on('error', (err) => {
     console.log(`Could not connect to the database. Exiting now... ${err}`);
     process.exit();
});

 // enable CORS - Cross Origin Resource Sharing
 app.use(cors());
 // It is Node.js body parser middleware. It parse the incoming request bodies in a middleware before your handlers, 
 // available under the req.body property.
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({
     extended: false
 }));
 app.use(cookieParser());



 // error handler
 app.use((err, req, res, next) => {
     // customize Joi validation errors
     if (err.isJoi) {
         err.message = err.details.map(e => e.message).join("; ");
         err.status = 400;
     } else if (err.name === 'ValidationError') {
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