var express = require('express');
var logger = require('morgan');
var app = express();

app.use(logger('dev'));


// how you can add the middlewar function using both methods, and with/without a route


var express = require('express');
var app = express();

// an exmaple middlewar function 
var a_middleware_function = function (req, res, next) {
    // ... perform some operations
    next(); // call next() so Express will call them next
};

// Function added use() for all routers and varbse

app.use(a_middleware_function);

// Function added with use() for a specific route

app.use('/someroute', a_middleware_function);

// A middleware function added for a specific http

app.get('/', a_middleware_function);


// Serving static files
app.use(express.static('public'));

// You can call static() multiple times to serve multiple directories. 
app.use(express.static('public'));
app.use(express.static('media'));

// You can also create a virtual prefix for your static URLs, rather than having the files added to the base URL.
app.use('/media', express.static('public'));






