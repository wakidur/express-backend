var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();

// get Genre
Genre = require('./models/genre');
// get Books
Book = require('./models/book');

// connect to Mongoose
mongoose.connect('mongodb://localhost/bookstore');
var db = mongoose.connection;

// get 
app.get('/', function (req, res) {
    res.send('Please use /api/books or /api/generes');
});

//get genres
app.get('/api/genres', function (req, res) {
    Genre.getGenres(function(err, genres){
        if(err){
            throw err;
        }
        res.json(genres);
    });
});

//get Books
app.get('/api/books', function (req, res) {
    Book.getBooks(function(err, books){
        if(err){
            throw err;
        }
        res.json(books);
    });
});
//get Book id
app.get('/api/books/:_id', function (req, res) {
    Book.getBookById(req.params._id, function(err, books){
        if(err){
            throw err;
        }
        res.json(books);
    });
});
app.listen(3030);
console.log("listend to 3000")