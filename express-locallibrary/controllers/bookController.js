var Book = require('../models/bookModel');
var Author = require('../models/authorModel');
var Genre = require('../models/genreModel');
var BookInstance = require('../models/bookinstanceModel');
var ifcond = require('../helper/ifconditionHelper');


var mongoose = require('mongoose');
var async = require('async');
/*
exports.index = function(req, res) {
    res.send('NOT IMPLEMENTED: Site Home Page');
};
*/

exports.index = function (req, res) {

    async.parallel({
        book_count: function (callback) {
            Book.count({}, callback); 
            // Pass an empty object as match condition to find all documents of this collection
        },
        book_instance_count: function (callback) {
            BookInstance.count({}, callback);
        },
        book_instance_available_count: function (callback) {
            BookInstance.count({
                status: 'Available'
            }, callback);
        },
        author_count: function (callback) {
            Author.count({}, callback);
        },
        genre_count: function (callback) {
            Genre.count({}, callback);
        },
    }, function (err, results) {
        res.render('index', {
            title: 'Local Library Home',
            error: err,
            data: results
        });
    });
};




// Display list of all books.
/* 
* Previous
exports.book_list = function (req, res) {
    res.send('NOT IMPLEMENTED: Book list');
};
*/
// Display list of all Books.
exports.book_list = function (req, res, next) {
    Book.find({}, 'title author')
        .populate('author')
        .exec(function (err, list_books) {
            if(err) {
                return next(err);
            }
            // successfull, so render
            res.render('./book/bookListView', {
                title: 'Book List',
                book_list: list_books
            });
          });
};
// Display detail page for a specific book.
/*
exports.book_detail = function (req, res) {
    res.send('NOT IMPLEMENTED: Book detail: ' + req.params.id);
};
*/

exports.book_detail = function(req, res, next) {
    var id = mongoose.Types.ObjectId(req.params.id);
    async.parallel({
        book: function (callback) {
            // Book.findById(req.params.id)
            Book.findById(id)
                .populate('author')
                .populate('genre')
                .exec(callback);
          },
        book_instance: function(callback) {
            BookInstance.find({'book' : id})
                .exec(callback);
        },
    }, function(err, results){
        if (err) {
            return next(err);
        }
        if (results.book_instance == null) {
            // No results
            var err = new Error('Book not found');
            err.status = 404;
            return next(err);
        }
        // successfull , so render.
        res.render('./book/bookDetail', {
            title: "Book",
            subtitle: "Title",
            book : results.book,
            book_instance: results.book_instance
        });
    });
};

// Display book create form on GET.
exports.book_create_get = function (req, res) {
    res.send('NOT IMPLEMENTED: Book create GET');
};

// Handle book create on POST.
exports.book_create_post = function (req, res) {
    res.send('NOT IMPLEMENTED: Book create POST');
};

// Display book delete form on GET.
exports.book_delete_get = function (req, res) {
    res.send('NOT IMPLEMENTED: Book delete GET');
};

// Handle book delete on POST.
exports.book_delete_post = function (req, res) {
    res.send('NOT IMPLEMENTED: Book delete POST');
};

// Display book update form on GET.
exports.book_update_get = function (req, res) {
    res.send('NOT IMPLEMENTED: Book update GET');
};

// Handle book update on POST.
exports.book_update_post = function (req, res) {
    res.send('NOT IMPLEMENTED: Book update POST');
};