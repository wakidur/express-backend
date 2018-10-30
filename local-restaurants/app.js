const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const uglifyJs = require("uglify-js");
const fs = require('fs');
const passport = require('passport');
require('./app_api/config/passport');
/**
 * Connect to MongoDB.
 */
const indexRouter = require('./app_server/routes/locationsRoutes');
const usersRouter = require('./app_server/routes/users');
const aboutRouter = require('./app_server/routes/aboutRoutes');

// Api Router
const apiRoutes = require('./app_api/routes/locationApiRoute');

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({
  path: '.env'
});

/**
 * Create Express server.
 */
const app = express();


let mongoDB = 'mongodb://localhost/Loc8r';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', console.log.bind("we're connected......... 3300"));

// view engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'pug');

// var appClientFiles = [
//   'app_client/app.js',
//   'app_client/home/home.controller.js',
//   'app_client/about/about.controller.js',
//   'app_client/auth/login/login.controller.js',
//   'app_client/auth/register/register.controller.js',
//   'app_client/locationDetail/locationDetail.controller.js',
//   'app_client/reviewModal/reviewModal.controller.js',
//   'app_client/common/services/authentication.service.js',
//   'app_client/common/services/geolocation.service.js',
//   'app_client/common/services/loc8rData.service.js',
//   'app_client/common/filters/formatDistance.filter.js',
//   'app_client/common/filters/addHtmlLineBreaks.filter.js',
//   'app_client/common/directives/navigation/navigation.controller.js',
//   'app_client/common/directives/navigation/navigation.directive.js',
//   'app_client/common/directives/footerGeneric/footerGeneric.directive.js',
//   'app_client/common/directives/pageHeader/pageHeader.directive.js',
//   'app_client/common/directives/ratingStars/ratingStars.directive.js'
// ];
// var uglified = uglifyJs.minify(appClientFiles, {
//   compress: false
// });

// fs.writeFile('public/angular/loc8r.min.js', uglified.code, function (err) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("Script generated and saved:", 'loc8r.min.js');
//   }
// });

// show favicon
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app_client')));

app.use('/api', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3300');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
// app.use('/', indexRouter);
// app.use('/users', usersRouter);
// app.use('/about', aboutRouter);

// API Router
app.use('/api', apiRoutes);

app.use(function(req, res) {
  res.sendFile(path.join(__dirname, 'app_client', 'index.html'));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;