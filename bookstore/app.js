// 11-03-2018
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();

// connect to Mongoose
mongoose.connect('mongodb://localhost/bookstore');
var db = mongoose.connection;

// get 
app.get('/', function (req, res) {
    res.send('Hello world');
});
app.get('/api', function (req, res) {
    res.send('Please use /api1/books or api/grand');
});

app.listen(3000);
console.log("Running on port 3000.........");