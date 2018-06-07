/*bookModel*/
var Book = require('../models/bookModel');
/*authorModel*/
var Author = require('../models/authorModel');
/*genreModel*/
var Genre = require('../models/genreModel');
/*bookinstanceModel*/
var BookInstance = require('../models/bookinstanceModel');
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


exports.homePage = homePage;
exports.book_list = bookList;
exports.book_detail = bookDetail;
exports.book_create_get = bookCreateGet;
exports.book_delete_get = bookDeleteGet;
exports.book_delete_post = bookDeletePost;
exports.book_update_get = bookUpdateGet;


// Site Home Page
function homePage(req, res, next) {
    booksService.getCount().then((value) => {
        res.render('index', {
            title: 'Local Library Home',
            data: value
        });
    }).catch((err) => {
        return next(err);
    });
}

// Display list of all Books.
function bookList(req, res, next) {
    booksService.getBookList().then((value) => {
        res.render('./book/bookListView', {
            title: 'Book List',
            book_list: value
        });
    }).catch((err) => {
        return next(err);
    });
}

// Display detail page for a specific book.
function bookDetail(req, res, next) {
    booksService.getBookDetail(req.params.id).then((results) => {
        if (results.book_instance == null) {
            // No results
            var err = new Error('Book not found');
            err.status = 404;
            return next(err);
        }
        // successfull , so render.
        res.render('./book/bookDetailView', {
            title: "Book",
            subtitle: "Title",
            book: results.book,
            book_instances: results.book_instance
        });
    }).catch((err) => {
        return next(err);
    });
}

// Display book create form on GET.
function bookCreateGet(req, res, next) {
    booksService.bookCreateGet().then((results) => {
        res.render('./book/bookFormView', {
            title: 'Create Book',
            authors: results.authors,
            genres: results.genres
        });
        console.log("Book create get");
    }).catch((err) => {
        return next(err);
    });
}

// Handle book create on POST.
exports.book_create_post = [
    // Convert the genre to an array.
    (req, res, next) => {
        if (!(req.body.genre instanceof Array)) {
            if (typeof req.body.genre === 'undefined') {
                req.body.genre = [];
            } else {
                req.body.genre = new Array(req.body.genre);
                console.log("Genre array check end" + req.body.genre);
            }
        }
        next();
    },

    // Validate fields.
    body('title', 'Title must not be empty.').isLength({ min: 1 }).trim(),
    body('author', 'Author must not be empty.').isLength({ min: 1 }).trim(),
    body('summary', 'Summary must not be empty.').isLength({ min: 1 }).trim(),
    body('isbn', 'ISBN must not be empty').isLength({ min: 1 }).trim(),

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
            booksService.bookCreatePost().then((results) => {
                // Mark our selected genres as checked.
                for (let i = 0; i < results.genres.length; i++) {
                    if (book.genre.indexOf(results.genres[i]._id) > -1) {
                        results.genres[i].checked = 'true';
                    }
                }
                res.render('./book/bookFormView', {
                    title: 'Create Book',
                    authors: results.authors,
                    genres: results.genres,
                    book: book,
                    errors: errors.array()
                });
            }).catch((err) => {
                return next(err);
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

// Display book delete form on GET.
function bookDeleteGet(req, res, next) {
    booksService.bookDeleteGet(req.params.id).then((results) => {
        if (results.book == null) { 
            // No results.
            res.redirect('/books');
        }
        // Successful, so render.
        res.render('./book/bookDeleteView', { 
            title: 'Delete Book', 
            book: results.book, 
            book_instances: results.book_bookinstances 
        });
    }).catch((err) => {
        return next(err);
    });
}

// Handle book delete on POST.
function bookDeletePost(req, res, next) {
    let reqId = req.body.id;
    // Assume the post has valid id (ie no validation/sanitization).
    booksService.bookDeletePost(reqId).then((results) => {
         // Success
         if (results.book_bookinstances.length > 0) {
            // Book has book_instances. Render in same way as for GET route.
            res.render('./book/bookDeleteView', { title: 'Delete Book', book: results.book, book_instances: results.book_bookinstances });
            return;
        } else {
            // Book has no BookInstance objects. Delete object and redirect to the list of books.
            Book.findByIdAndRemove(reqId, function deleteBook(err) {
                if (err) { return next(err); }
                // Success - got to books list.
                res.redirect('/books');
            });
        }
    }).catch((err) => {
        return next(err);
    });
}

// Display book update form on GET.
function bookUpdateGet(req, res, next) {
    // Get book, authors and genres for form.
    booksService.bookUpdateGet(req.params.id).then((results) => {
        if (results.book == null) { // No results.
            var err = new Error('Book not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        // Mark our selected genres as checked.
        for (var all_g_iter = 0; all_g_iter < results.genres.length; all_g_iter++) {
            for (var book_g_iter = 0; book_g_iter < results.book.genre.length; book_g_iter++) {
                if (results.genres[all_g_iter]._id.toString() == results.book.genre[book_g_iter]._id.toString()) {
                    results.genres[all_g_iter].checked = 'true';
                }
            }
        }
        res.render('./book/bookFormView', { 
            title: 'Update Book', 
            authors: results.authors, 
            genres: results.genres, 
            book: results.book 
        });
    }).catch((err) => {
        return next(err);
    });
}


// Handle book update on POST.
exports.book_update_post = [

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
    body('title', 'Title must not be empty.').isLength({ min: 1 }).trim(),
    body('author', 'Author must not be empty.').isLength({ min: 1 }).trim(),
    body('summary', 'Summary must not be empty.').isLength({ min: 1 }).trim(),
    body('isbn', 'ISBN must not be empty').isLength({ min: 1 }).trim(),

    // Sanitize fields.
    sanitizeBody('title').trim().escape(),
    sanitizeBody('author').trim().escape(),
    sanitizeBody('summary').trim().escape(),
    sanitizeBody('isbn').trim().escape(),
    sanitizeBody('genre.*').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Book object with escaped/trimmed data and old id.
        var book = new Book({
            title: req.body.title,
            author: req.body.author,
            summary: req.body.summary,
            isbn: req.body.isbn,
            genre: (typeof req.body.genre === 'undefined') ? [] : req.body.genre,
            _id: req.params.id // This is required, or a new ID will be assigned!
        });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and genres for form
            booksService.bookUpdatePost().then((results) => {
                 // Mark our selected genres as checked.
                 for (let i = 0; i < results.genres.length; i++) {
                    if (book.genre.indexOf(results.genres[i]._id) > -1) {
                        results.genres[i].checked = 'true';
                    }
                }
                res.render('./book/bookFormView', { 
                    title: 'Update Book', 
                    authors: results.authors,
                    genres: results.genres, 
                    book: book, 
                    errors: errors.array() });
            }).catch((err) => {
                return next(err);
            });
            return;
        } else {
            // Data from form is valid. Update the record.
            Book.findByIdAndUpdate(req.params.id, book, {}, function (err, thebook) {
                if (err) { return next(err); }
                // Successful - redirect to book detail page.
                res.redirect(thebook.url);
            });
        }
    }
];