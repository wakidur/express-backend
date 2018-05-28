/*import  genreModel*/
var Genre = require('../models/genreModel');

/* import  bookModel */
var Book = require('../models/bookModel');
/*mongoose*/
var mongoose = require('mongoose');
/* Import validation and sanitisation methods */
const {
    body,
    validationResult
} = require('express-validator/check');
const {
    sanitizeBody
} = require('express-validator/filter');

/* Import async */
var async = require('async');

let genreService = require('../services/genreService');

exports.genre_list = genreList;
exports.genre_detail = genreDetail;
exports.genre_create_get = genreCreateGet;
exports.genre_delete_get = getGenreDelete;
exports.genre_delete_post = postGenreDelete;
exports.genre_update_get = getGenreUpdate

// Display list of all Genre.
function genreList(req, res, next) {
    genreService.getGenreList().then((value) => {
        //Successful , so render
        res.render('./genre/genreListView', {
            title: 'Genre List',
            genre_list: value
        });
    }).catch((err) => {
        return next(err);
    });
}

// Display detail page for a specific Genre.
function genreDetail(req, res, next) {
    let id = mongoose.Types.ObjectId(req.params.id);
    genreService.getGenreDetail(id).then((results) => {
        if (results.genre == null) {
            // no results.
            var err = new Error('Genre not found');
            err.status = 404;
            return next(err);
        }
        // successfull, so render 
        res.render('./genre/genreDetailView', {
            title: "Genre Detail",
            genre: results.genre,
            genre_books: results.genre_books
        });
    }).catch((err) => {
        return next(err);
    });
}

// Display Genre create form on GET.
function genreCreateGet(req, res, next) {
    res.render('./genre/genreFormView', {
        title: 'Create Genre'
    });
};

// Handle Genre create on POST.
exports.genre_create_post = [

    // Validate that the name field is not empty.
    body('name', 'Genre name required').isLength({ min: 1 }).trim(),

    // Sanitize (trim and escape) the name field.
    sanitizeBody('name').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a genre object with escaped and trimmed data.
        var genre = new Genre({
            name: req.body.name
        });


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('./genre/genreFormView', {
                title: 'Create Genre',
                genre: genre,
                errors: errors.array()
            });
            return;
        } else {
            // Data from form is valid.
            // Check if Genre with same name already exists.
            genreService.genreCreatePost(req.body.name).then((found_genre) => {
                if (found_genre) {
                    // Genre exists, redirect to its detail page.
                    res.redirect(found_genre.url);
                } else {
                    genre.save(function(err) {
                        if (err) {
                            return next(err);
                        }
                        // Genre saved. Redirect to genre detail page.
                        res.redirect(genre.url);
                    });
                }
            }).catch((err) => {
                return next(err);
            });
        }
    }
];
// Display Genre delete form on GET.
function getGenreDelete(req, res, next) {
    genreService.genreDeleteGet(req.params.id).then((results) => {
        if (results.genre == null) { // No results.
            res.redirect('/catalog/genres');
        }
        // Successful, so render.
        res.render('./genre/genreDeleteView', {
            title: 'Delete Genre',
            genre: results.genre,
            genre_books: results.genre_books
        });
    }).catch((err) => {
        return next(err);
    });
};

// Handle Genre delete on POST.
function postGenreDelete(req, res, next) {
    genreService.genreDeletePost(req.params.id).then((results) => {
        // Success
        if (results.genre_books.length > 0) {
            // Genre has books. Render in same way as for GET route.
            res.render('./genre/genreDeleteView', {
                title: 'Delete Genre',
                genre: results.genre,
                genre_books: results.genre_books
            });
            return;
        } else {
            // Genre has no books. Delete object and redirect to the list of genres.
            Genre.findByIdAndRemove(req.body.id, function deleteGenre(err) {
                if (err) {
                    return next(err);
                }
                // Success - go to genres list.
                res.redirect('/genres');
            });
        }
    }).catch((err) => {
        return next(err);
    });
};

// Display Genre update form on GET.
function getGenreUpdate(req, res, next) {
    genreService.genreUpdateGet(req.params.id).then((result) => {
        if (genre == null) { // No results.
            var err = new Error('Genre not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.render('./genre/genreFormView', {
            title: 'Update Genre',
            genre: result
        });
    }).catch((err) => {
        return next(err);
    });
};

// Handle Genre update on POST.
exports.genre_update_post = [

    // Validate that the name field is not empty.
    body('name', 'Genre name required').isLength({
        min: 1
    }).trim(),

    // Sanitize (trim and escape) the name field.
    sanitizeBody('name').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request .
        const errors = validationResult(req);

        // Create a genre object with escaped and trimmed data (and the old id!)
        var genre = new Genre({
            name: req.body.name,
            _id: req.params.id
        });
        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.
            res.render('./genre/genreFormView', {
                title: 'Update Genre',
                genre: genre,
                errors: errors.array()
            });
            return;
        } else {
            // Data from form is valid. Update the record.
            genreService.genreUpdatePost(req.params.id, genre).then((results) => {
                // Successful - redirect to genre detail page.
                res.redirect(results.url);
            }).catch((err) => {
                return next(err);
            });
        }
    }
];