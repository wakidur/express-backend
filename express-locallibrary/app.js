var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// var index = require('./routes/index');
var users = require('./routes/users'); //Import routes for "users" area of site
var catalog = require('./routes/catalog'); //Import routes for "catalog" area of site
var compression = require('compression');
var helmet = require('helmet');

// Create the Express application object
var app = express();

app.use(helmet());

// Set up mongoose connection
var mongoose = require('mongoose');
//var dev_db_url = "mongodb://localhost/local_library";
var dev_db_url = "mongodb://wakidur:Wakidur_234@ds117010.mlab.com:17010/local_library";
var mongoDB = process.env.MONGODB_URI || dev_db_url;
// production 
// var mongoDB = process.env.MONGODB_URI || 'mongodb://wakidur:Wakidur_234@ds117010.mlab.com:17010/local_library';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', console.log.bind("we're connected"));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(compression()); //Compress all routes

app.use(express.static(path.join(__dirname, 'public')));


// app.use('/', index);
app.use('/users', users); // Add users routes to middleware chain.
app.use('/', catalog); // Add catalog routes to middleware chain.

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;