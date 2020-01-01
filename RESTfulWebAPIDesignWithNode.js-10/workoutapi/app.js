 const express = require('express');
 const methodOverride = require('method-override');
 const httpError = require('http-errors');
 const cors = require('cors');
 const path = require('path');
 const cookieParser = require('cookie-parser');
 const bodyParser = require('body-parser');
 const morgan = require('morgan');
 const swaggerUi = require('swagger-ui-express');
 const swaggerDocument = require('./config/swagger.json');

 const passport = require('./config/passportConfig');
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
 const mongoDBLocalHostUri = config.mongo.host;
 const mongoDBmLabUri = config.mongo.hostserver;
 const mongoDBAtlasClusterUri = config.mongo.hostcluster;

 mongoose.connect(mongoDBLocalHostUri, {
     useNewUrlParser: true,
     useCreateIndex: true,
     useFindAndModify: false,
     useUnifiedTopology: true,
     keepAlive: 1,
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

 //  app.use('/uploads', express.static('uploads'));
 app.use(express.static(__dirname));
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({
     extended: true
 }));
 app.use(morgan('dev'));
 app.use(cookieParser());
 app.use(methodOverride());
 app.use(passport.initialize());

 app.use('/api/users', users);
 app.use('/api', trainerRoutes);
 app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

 // catch 404 and forward to error handler
 app.use((req, res, next) => {
     const err = new httpError(404)
     return next(err);
 });

 // error handler, send stacktrace only during development
 app.use((err, req, res, next) => {
     // customize Joi validation errors
     if (err.isJoi) {
         err.message = err.details.map(e => e.message).join("; ");
         err.status = 400;
         res.status(400).json({
             status: err.status,
             message: err.message
         });
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



 module.exports = app;