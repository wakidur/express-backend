var BookInstance = require('../models/bookinstanceModel');
var Book = require('../models/bookModel')
var async = require('async')

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var BooksInstanceService = require('../services/bookinstanceService');


exports.bookInstanceList = bookInstanceList;




/**
 * 
 * @param {*} req 
 * @param {*} res 
 * 
 * // Display list of all BookInstances.
 * exports.bookinstance_list = function(req, res) {
        res.send('NOT IMPLEMENTED: BookInstance list');
    };
 */
// Display list of all BookInstances.
function bookInstanceList(req, res, next) {
    BooksInstanceService.getBookinstanceList().then((value) =>{
        res.render('./bookinstance/bookinstanceListView', {
            title: 'Book Instance List',
            bookinstance_list: value
        });
    }).catch((err) => {
        return next(err);
    });
   
}


// Display detail page for a specific BookInstance.
/*
exports.bookinstance_detail = function (req, res) {
    res.send('NOT IMPLEMENTED: BookInstance detail: ' + req.params.id);
};
*/
exports.bookinstance_detail = function (req, res, next) {
    BookInstance.findById(req.params.id)
        .populate('book')
        .exec(function (err, bookinstance) { 
            if (err) {
                return next(err);
            }
            if(bookinstance == null) {
                // no result 
                var err = new Error('Book copy not found');
                    err.status = 404;
                    return next(err);
            }
            // successful, so render.
            res.render('./bookinstance/bookinstanceDetailView', {title: "Book", bookinstance: bookinstance});
         });
  };


// Display BookInstance create form on GET.
// Display BookInstance create form on GET.
exports.bookinstance_create_get = function(req, res, next) {

    Book.find({},'title')
   .exec(function (err, books) {
     if (err) { return next(err); }
     // Successful, so render.
     res.render('./bookinstance/bookInstanceFormView', {title: 'Create BookInstance', book_list:books } );
   });

};
// Handle BookInstance create on POST.
// exports.bookinstance_create_post = function (req, res) {
//     res.send('NOT IMPLEMENTED: BookInstance create POST');
// };

exports.bookinstance_create_post = [

    // Validate fields.
    body('book', 'Book must be specified').isLength({ min: 1 }).trim(),
    body('imprint', 'Imprint must be specified').isLength({ min: 1 }).trim(),
    body('due_back', 'Invalid date').optional({ checkFalsy: true }).isISO8601(),
    
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
        var bookinstance = new BookInstance(
          { book: req.body.book,
            imprint: req.body.imprint,
            status: req.body.status,
            due_back: req.body.due_back
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values and error messages.
            Book.find({},'title')
                .exec(function (err, books) {
                    if (err) { return next(err); }
                    // Successful, so render.
                    res.render('./bookinstance/bookInstanceFormView', { title: 'Create BookInstance', book_list : books, selected_book : bookinstance.book._id , errors: errors.array(), bookinstance:bookinstance });
            });
            return;
        }
        else {
            // Data from form is valid
            bookinstance.save(function (err) {
                if (err) { return next(err); }
                   // Successful - redirect to new record.
                   res.redirect(bookinstance.url);
                });
        }
    }
];
// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = function(req, res, next) {

    BookInstance.findById(req.params.id)
    .populate('book')
    .exec(function (err, bookinstance) {
        if (err) { return next(err); }
        if (bookinstance==null) { // No results.
            res.redirect('/catalog/bookinstances');
        }
        // Successful, so render.
        res.render('./bookinstance/bookinstanceDeleteView', { title: 'Delete BookInstance', bookinstance:  bookinstance});
    })

};

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = function(req, res, next) {
    
    // Assume valid BookInstance id in field.
    BookInstance.findByIdAndRemove(req.body.id, function deleteBookInstance(err) {
        if (err) { return next(err); }
        // Success, so redirect to list of BookInstance items.
        res.redirect('/bookinstances');
        });

};

// Display BookInstance update form on GET.
// exports.bookinstance_update_get = function (req, res) {
//     res.send('NOT IMPLEMENTED: BookInstance update GET');
// };

exports.bookinstance_update_get = function(req, res, next) {

    // Get book, authors and genres for form.
    async.parallel({
        bookinstance: function(callback) {
            BookInstance.findById(req.params.id).populate('book').exec(callback)
        },
        books: function(callback) {
            Book.find(callback)
        },

        }, function(err, results) {
            if (err) { return next(err); }
            if (results.bookinstance==null) { // No results.
                var err = new Error('Book copy not found');
                err.status = 404;
                return next(err);
            }
            // Success.
            res.render('./bookinstance/bookInstanceFormView', { title: 'Update  BookInstance', book_list : results.books, selected_book : results.bookinstance.book._id, bookinstance:results.bookinstance });
        });

};

// Handle bookinstance update on POST.
// exports.bookinstance_update_post = function (req, res) {
//     res.send('NOT IMPLEMENTED: BookInstance update POST');
// };

exports.bookinstance_update_post = [

    // Validate fields.
    body('book', 'Book must be specified').isLength({ min: 1 }).trim(),
    body('imprint', 'Imprint must be specified').isLength({ min: 1 }).trim(),
    body('due_back', 'Invalid date').optional({ checkFalsy: true }).isISO8601(),
    
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
        var bookinstance = new BookInstance(
          { book: req.body.book,
            imprint: req.body.imprint,
            status: req.body.status,
            due_back: req.body.due_back,
            _id: req.params.id
           });

        if (!errors.isEmpty()) {
            // There are errors so render the form again, passing sanitized values and errors.
            Book.find({},'title')
                .exec(function (err, books) {
                    if (err) { return next(err); }
                    // Successful, so render.
                    res.render('./bookinstance/bookInstanceFormView', { title: 'Update BookInstance', book_list : books, selected_book : bookinstance.book._id , errors: errors.array(), bookinstance:bookinstance });
            });
            return;
        }
        else {
            // Data from form is valid.
            BookInstance.findByIdAndUpdate(req.params.id, bookinstance, {}, function (err,thebookinstance) {
                if (err) { return next(err); }
                   // Successful - redirect to detail page.
                   res.redirect(thebookinstance.url);
                });
        }
    }
];


