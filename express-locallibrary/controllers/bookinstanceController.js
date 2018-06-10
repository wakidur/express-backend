/*----------------- require Model -----------------*/
var BookInstance = require('../models/bookinstanceModel');
var Book = require('../models/bookModel')
var async = require('async')

/*-----------------require express-validator -----------------*/
const {
    body,
    validationResult
} = require('express-validator/check');
const {
    sanitizeBody
} = require('express-validator/filter');

/*-----------------require BooksInstance Service -----------------*/
var BooksInstanceService = require('../services/bookinstanceService');

/*----------------- exports controller-----------------*/
exports.bookInstanceList = bookInstanceList;
exports.bookinstance_detail = bookinstanceDetail;
exports.bookinstance_create_get = bookinstanceCreateGet;
exports.bookinstance_delete_get = bookinstanceDeleteGet;
exports.bookinstance_delete_post  = bookinstanceDeletePost;
exports.bookinstance_update_get = bookinstanceUpdateGet;

// Display list of all BookInstances.
function bookInstanceList(req, res, next) {
    BooksInstanceService.getBookinstanceList().then((values) => {
        res.render('./bookinstance/bookinstanceListView', {
            title: 'Book Instance List',
            bookinstance_list: values
        });
    }).catch((err) => {
        return next(err);
    });

}

// Display detail page for a specific BookInstance.
function bookinstanceDetail(req, res, next) {
    BooksInstanceService.getBookinstanceDetail(req.params.id).then((bookinstance) => {
        if (bookinstance == null) {
            // no result 
            let err = new Error('Book copy not found');
            err.status = 404;
            return next(err);
        }
        // successful, so render.
        res.render('./bookinstance/bookinstanceDetailView', {
            title: "Book",
            bookinstance: bookinstance
        });
    }).catch((err) => {
        return next(err);
    });
}

// Display BookInstance create form on GET.
function bookinstanceCreateGet(req, res, next) {
    BooksInstanceService.BookinstanceCreateGet().then((results) => {
        // Successful, so render.
        res.render('./bookinstance/bookInstanceFormView', {
            title: 'Create BookInstance',
            book_list: results
        });
    }).catch((err) => {
        return next(err);
    });
}
// Handle BookInstance create on POST.


exports.bookinstance_create_post = [
    // Validate fields.
    body('book', 'Book must be specified').isLength({
        min: 1
    }).trim(),
    body('imprint', 'Imprint must be specified').isLength({
        min: 1
    }).trim(),
    body('due_back', 'Invalid date').optional({
        checkFalsy: true
    }).isISO8601(),

    // Sanitize fields.
    sanitizeBody('book').trim().escape(),
    sanitizeBody('imprint').trim().escape(),
    sanitizeBody('status').trim().escape(),
    sanitizeBody('due_back').toDate(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a BookInstance object with escaped and trimmed data.
        var bookinstance = new BookInstance({
            book: req.body.book,
            imprint: req.body.imprint,
            status: req.body.status,
            due_back: req.body.due_back
        });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values and error messages.
            BooksInstanceServiceBook.BookinstanceCreatePost().then((books) => {
                res.render('./bookinstance/bookInstanceFormView', {
                    title: 'Create BookInstance',
                    book_list: books,
                    selected_book: bookinstance.book._id,
                    errors: errors.array(),
                    bookinstance: bookinstance
                });
            }).catch((err) => {
                return next(err);
            });
            return;
        } else {
            // Data from form is valid
            bookinstance.save(function (err) {
                if (err) {
                    return next(err);
                }
                // Successful - redirect to new record.
                res.redirect(bookinstance.url);
            });
        }
    }
];
// Display BookInstance delete form on GET.
function bookinstanceDeleteGet(req, res, next) {
    BooksInstanceService.BookinstanceDeleteGet(req.params.id).then((bookinstance) => {
        if (bookinstance == null) { // No results.
            res.redirect('/catalog/bookinstances');
        }
        // Successful, so render.
        res.render('./bookinstance/bookinstanceDeleteView', {
            title: 'Delete BookInstance',
            bookinstance: bookinstance
        });
    }).catch((err) => {
        return next(err);
    });    
}

// Handle BookInstance delete on POST.
function bookinstanceDeletePost(req, res, next) {
    // Assume valid BookInstance id in field.
    BooksInstanceService.BookinstanceDeletePost(req.body.id).then(() => {
        // Success, so redirect to list of BookInstance items.
        res.redirect('/bookinstances');
    }).catch((err) => {
        return next(err);
    });
}

// Display BookInstance update form on GET.
 function bookinstanceUpdateGet(req, res, next) {
    // Get book, authors and genres for form.
    BooksInstanceService.BookinstanceUpdateGet(req.params.id).then((results) => {
        if (results.bookinstance==null) { // No results.
            var err = new Error('Book copy not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.render('./bookinstance/bookInstanceFormView', { 
            title: 'Update  BookInstance', 
            book_list : results.books, 
            selected_book : results.bookinstance.book._id, bookinstance:results.bookinstance 
        });
    }).catch((err) => {
        return next(err);
    });
}

// Handle bookinstance update on POST.

exports.bookinstance_update_post = [

    // Validate fields.
    body('book', 'Book must be specified').isLength({
        min: 1
    }).trim(),
    body('imprint', 'Imprint must be specified').isLength({
        min: 1
    }).trim(),
    body('due_back', 'Invalid date').optional({
        checkFalsy: true
    }).isISO8601(),

    // Sanitize fields.
    sanitizeBody('book').trim().escape(),
    sanitizeBody('imprint').trim().escape(),
    sanitizeBody('status').trim().escape(),
    sanitizeBody('due_back').toDate(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a BookInstance object with escaped/trimmed data and current id.
        var bookinstance = new BookInstance({
            book: req.body.book,
            imprint: req.body.imprint,
            status: req.body.status,
            due_back: req.body.due_back,
            _id: req.params.id
        });

        if (!errors.isEmpty()) {
            // There are errors so render the form again, passing sanitized values and errors.
            BooksInstanceService.BookinstanceUpdatePost().then((books) => {
                 // Successful, so render.
                 res.render('./bookinstance/bookInstanceFormView', {
                    title: 'Update BookInstance',
                    book_list: books,
                    selected_book: bookinstance.book._id,
                    errors: errors.array(),
                    bookinstance: bookinstance
                });
            }).catch((err) => {
                return next(err);
            });
            return;
        } else {
            // Data from form is valid.
            BooksInstanceService.findByIdBookinstanceUpdatePost(req.params.id, bookinstance).then((thebookinstance) => {
                // Successful - redirect to detail page.
                res.redirect(thebookinstance.url);
            }).catch((err) => {
                return next(err);
            });
        }
    }
];