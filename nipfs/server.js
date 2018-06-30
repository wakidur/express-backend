// Dependencies requirements, Express
var express = require('express');
var session = require('express-session');
var http = require('http');
var morgan = require('morgan');
var bodyParser = require('body-parser');

var methodOverride = require('method-override');
var DB = require('./DBAccess');

// routers
var routes = require('./api/index');
var fieldServicedataRoutes = require('./api/fieldServiceApi');
var fieldSpecDataRoutes = require('./api/fieldSpecsApi');  // field specification api 
var moduleServiceDataRoute = require('./api/moduleServiceApi');
var pageSectionDataRoute = require('./api/pageSectionApi');
var applicationDataRoute = require('./api/applicationApi');
var moduleEntryDataRoute = require('./api/moduleEntryApi');
var commonServiceDataRoute = require('./api/commonServiceApi');
var fieldValidationServiceDataRoute = require('./api/fieldValidationApi');

//main app
var app = express();
var dirPath = "/";

// view engine setup
app.set('port', process.env.PORT || 6661);
app.set('views', __dirname + dirPath + 'views');
app.set('view engine', 'jade');
app.use(session({ secret: 'proptotypestandard', saveUninitialized: true, resave: true }));

// use of dependencies
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));// pull information from html in POST
app.use(express.static(__dirname + dirPath));   // set the static files location
app.use(morgan('dev')); 					// log every request to the console
app.use(methodOverride()); 					// simulate DELETE and PUT
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//use api
var baseUrl = '/api';

//http://localhost:6666/api/fieldServicedata/SaveFieldServiceData

app.use('/', routes);
app.use(baseUrl + '/fieldServicedata', fieldServicedataRoutes);
app.use(baseUrl + '/fieldSpecsData', fieldSpecDataRoutes);
app.use(baseUrl + '/moduleServiceData', moduleServiceDataRoute); // page_section data 
app.use(baseUrl + '/pageSectionData', pageSectionDataRoute);
app.use(baseUrl + '/applicationData', applicationDataRoute);
app.use(baseUrl + '/moduleEntrydata', moduleEntryDataRoute);   // module entry data 
app.use(baseUrl + '/commonServiceData', commonServiceDataRoute);   // module entry data 
app.use(baseUrl + '/fieldValidationServiceData', fieldValidationServiceDataRoute);   // module entry data 

 
//open database connection
//var conn = 'mongodb://192.168.9.6:27017/projectfileservicedb';
var conn = 'mongodb://localhost/projectfileservicedb';
var db = new DB.startup(conn);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
process.on('uncaughtException', function (err) {
    if (err) console.log(err, err.stack);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// Start server
http.createServer(app).listen(app.get('port'), function () {
    console.log("project file service application is running on port %d in %s mode", this.address().port, app.settings.env);
});

module.exports = app;