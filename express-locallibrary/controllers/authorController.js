/*authorModel*/
var Author = require('../models/authorModel');
/*bookModel*/
var Book = require('../models/bookModel');
/*async*/
var async = require('async');
/*body,validationResult */
const {
    body,
    validationResult
} = require('express-validator/check');
const {
    sanitizeBody
} = require('express-validator/filter');

let authorService = require('../services/authorService');

exports.author_list = authorList;
exports.author_detail = authorDetail;
exports.author_create_get = authorCreateGet;
exports.author_delete_get = authorDeleteGet;
exports.author_delete_post = authorDeletePost;
exports.author_update_get = authorUpdateGet;

// Display list of all Authors.
function authorList(req, res) {
    authorService.getAuthorList().then((result) => {
        res.render('./author/authorListView', {
            title: 'Author List',
            author_list: result
        });
    }).catch((err) => {
        return next(err);
    });
}

// Display detail page for a specific Author.
function authorDetail(req, res, next) {
    authorService.getAuthorDetail(req.params.id).then((results) => {
        if (results.authors_books == null) {
            // No results.
            var err = new Error('Author not found');
            err.status = 404;
            return next(err);
        }
        res.render('./author/authorDetailView', {
            title: 'Author Detail',
            author: results.author,
            author_books: results.authors_books
        });
    }).catch((err) => {
        return next(err);
    });
}


// Display Author create form on GET.
function authorCreateGet(req, res, next) {
    res.render('./author/authorFormView', {
        title: 'Create Author'
    });
}
// Handle Author create on POST.
exports.author_create_post = [

    // Validate fields.
    body('first_name')
    .isLength({
        min: 1
    })
    .trim()
    .withMessage('First name must be specified.')
    .isAlphanumeric()
    .withMessage('First name has non-alphanumeric characters.'),

    body('family_name')
    .isLength({
        min: 1
    })
    .trim()
    .withMessage('Family name must be specified.')
    .isAlphanumeric()
    .withMessage('Family name has non-alphanumeric characters.'),

    body('date_of_birth', 'Invalid date of birth')
    .optional({
        checkFalsy: true
    })
    .isISO8601(),

    body('date_of_death', 'Invalid date of death')
    .optional({
        checkFalsy: true
    })
    .isISO8601(),

    // Sanitize fields.
    sanitizeBody('first_name').trim().escape(),
    sanitizeBody('family_name').trim().escape(),
    sanitizeBody('date_of_birth').toDate(),
    sanitizeBody('date_of_death').toDate(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('./author/authorFormView', {
                title: 'Create Author',
                author: req.body,
                errors: errors.array()
            });
            return;
        } else {
            // Data from form is valid.

            // Create an Author object with escaped and trimmed data.
            var author = new Author({
                first_name: req.body.first_name,
                family_name: req.body.family_name,
                date_of_birth: req.body.date_of_birth,
                date_of_death: req.body.date_of_death
            });
            author.save(function (err) {
                if (err) {
                    return next(err);
                }
                // Successful - redirect to new author record.
                res.redirect(author.url);
            });
        }
    }
];

// Display Author delete form on GET.
function authorDeleteGet(req, res, next) {
    authorService.AuthorDeleteGet(req.params.id).then((results) => {
        if (results.author == null) { 
            // No results.
            res.redirect('/authors');
        }
        // Successful, so render.
        res.render('./author/authorDeleteView', {
            title: 'Delete Author',
            author: results.author,
            author_books: results.authors_books
        });
    }).catch((err) => {
        return next(err);
    });
}

// Handle Author delete on POST.
function authorDeletePost(req, res, next) {
    authorService.AuthorDeletePost(req.body.authorid).then((result) => {
        // Success.
        if (results.authors_books.length > 0) {
            // Author has books. Render in same way as for GET route.
            res.render('./author/authorDeleteView', {
                title: 'Delete Author',
                author: results.author,
                author_books: results.authors_books
            });
            return;
        } else {
            // Author has no books. Delete object and redirect to the list of authors.
            Author.findByIdAndRemove(req.body.authorid, function deleteAuthor(err) {
                if (err) {
                    return next(err);
                }
                // Success - go to author list.
                res.redirect('/authors')
            })
        }
    }).catch((err) => {
        return next(err);
    });

};


// Display Author update form on GET.
// exports.author_update_get = function(req, res) {
//     res.send('NOT IMPLEMENTED: Author update GET');
// };

function authorUpdateGet(req, res, next) {
    authorService.AuthorUpdateGet(req.params.id).then((author) => {
        if (author == null) { // No results.
            var err = new Error('Author not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.render('./author/authorFormView', {
            title: 'Update Author',
            author: author
        });
    }).catch((err) => {
        return next(err);
    });
}
// Handle Author update on POST.
// exports.author_update_post = function(req, res) {
//     res.send('NOT IMPLEMENTED: Author update POST');
// };

exports.author_update_post = [

    // Validate fields.
    body('first_name').isLength({
        min: 1
    }).trim().withMessage('First name must be specified.')
    .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('family_name').isLength({
        min: 1
    }).trim().withMessage('Family name must be specified.')
    .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body('date_of_birth', 'Invalid date of birth').optional({
        checkFalsy: true
    }).isISO8601(),
    body('date_of_death', 'Invalid date of death').optional({
        checkFalsy: true
    }).isISO8601(),

    // Sanitize fields.
    sanitizeBody('first_name').trim().escape(),
    sanitizeBody('family_name').trim().escape(),
    sanitizeBody('date_of_birth').toDate(),
    sanitizeBody('date_of_death').toDate(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create Author object with escaped and trimmed data (and the old id!)
        var author = new Author({
            first_name: req.body.first_name,
            family_name: req.body.family_name,
            date_of_birth: req.body.date_of_birth,
            date_of_death: req.body.date_of_death,
            _id: req.params.id
        });

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.
            res.render('./author/authorFormView', {
                title: 'Update Author',
                author: author,
                errors: errors.array()
            });
            return;
        } else {
            // Data from form is valid. Update the record.
            Author.findByIdAndUpdate(req.params.id, author, {}, function (err, theauthor) {
                if (err) {
                    return next(err);
                }
                // Successful - redirect to genre detail page.
                res.redirect(theauthor.url);
            });
        }
    }
];