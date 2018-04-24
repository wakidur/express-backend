/*bookModel*/
var Book = require('../models/bookModel');
/*authorModel*/
var Author = require('../models/authorModel');
/*genreModel*/
var Genre = require('../models/genreModel');
/*bookinstanceModel*/
var BookInstance = require('../models/bookinstanceModel');
/*ifconditionHelper*/
var ifcond = require('../helper/ifconditionHelper');
/*mongoose*/
var mongoose = require('mongoose');
/*async*/
var async = require('async');
/*body validationResult */
const {
    body,
    validationResult
} = require('express-validator/check');
const {
    sanitizeBody
} = require('express-validator/filter');

var booksService = require('../services/booksService');


exports.index = index;
exports.book_list = bookList;
exports.book_detail = bookDetail;
exports.book_create_get = bookCreateGet;
exports.book_create_post = bookCreatePost;


// Site Home Page
function index(req, res) {
    booksService.getCount().then((value) => {
        res.render('index', {
            title: 'Local Library Home',
            data: value
        });
    }).catch((err) => {
        res.render('index', {
            title: 'Local Library Home',
            error: err,

        });
    });
}

// Display list of all Books.
function bookList(req, res, next) {
    Book.find({}, 'title author')
        .populate('author')
        .exec(function (err, list_books) {
            if (err) {
                return next(err);
            }
            // successfull, so render
            res.render('./book/bookListView', {
                title: 'Book List',
                book_list: list_books
            });
        });
}


// Display detail page for a specific book.
function bookDetail(req, res, next) {
    var id = mongoose.Types.ObjectId(req.params.id);
    async.parallel({
        book: function (callback) {
            // Book.findById(req.params.id)
            Book.findById(id)
                .populate('author')
                .populate('genre')
                .exec(callback);
        },
        book_instance: function (callback) {
            BookInstance.find({
                    'book': id
                })
                .exec(callback);
        },
    }, function (err, results) {
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
            book: results.book,
            book_instance: results.book_instance
        });
    });
}

// Display book create form on GET.
function bookCreateGet(req, res, next) {

    // Get all authors and genres, which we can use for adding to our book.
    async.parallel({
        authors: function (callback) {
            Author.find(callback);
        },
        genres: function (callback) {
            Genre.find(callback);
        },
    }, function (err, results) {
        if (err) {
            return next(err);
        }
        res.render('./book/bookForm', {
            title: 'Create Book',
            authors: results.authors,
            genres: results.genres
        });
    });

}

// Handle book create on POST.
function bookCreatePost() {
    return [
        // Convert the genre to an array.
        (req, res, next) => {
            if (!(req.body.genre instanceof Array)) {
                if (typeof req.body.genre === 'undefined')
                    req.body.genre = [];
                else
                    req.body.genre = new Array(req.body.genre);
            }
            next();
        },

        // Validate fields.
        body('title', 'Title must not be empty.').isLength({
            min: 1
        }).trim(),
        body('author', 'Author must not be empty.').isLength({
            min: 1
        }).trim(),
        body('summary', 'Summary must not be empty.').isLength({
            min: 1
        }).trim(),
        body('isbn', 'ISBN must not be empty').isLength({
            min: 1
        }).trim(),

        // Sanitize fields (using wildcard).
        sanitizeBody('*').trim().escape(),

        // Process request after validation and sanitization.
        (req, res, next) => {

            // Extract the validation errors from a request.
            const errors = validationResult(req);

            // Create a Book object with escaped and trimmed data.
            var book = new Book({
                title: req.body.title,
                author: req.body.author,
                summary: req.body.summary,
                isbn: req.body.isbn,
                genre: req.body.genre
            });

            if (!errors.isEmpty()) {
                // There are errors. Render form again with sanitized values/error messages.

                // Get all authors and genres for form.
                async.parallel({
                    authors: function (callback) {
                        Author.find(callback);
                    },
                    genres: function (callback) {
                        Genre.find(callback);
                    },
                }, function (err, results) {
                    if (err) {
                        return next(err);
                    }

                    // Mark our selected genres as checked.
                    for (let i = 0; i < results.genres.length; i++) {
                        if (book.genre.indexOf(results.genres[i]._id) > -1) {
                            results.genres[i].checked = 'true';
                        }
                    }
                    res.render('./book/bookForm', {
                        title: 'Create Book',
                        authors: results.authors,
                        genres: results.genres,
                        book: book,
                        errors: errors.array()
                    });
                });
                return;
            } else {
                // Data from form is valid. Save book.
                book.save(function (err) {
                    if (err) {
                        return next(err);
                    }
                    //successful - redirect to new book record.
                    res.redirect(book.url);
                });
            }
        }
    ];

}

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